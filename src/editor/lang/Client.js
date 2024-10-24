import * as vscode from 'vscode'
import { LogLevel } from 'vscode/services'
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory'

// import { useOpenEditorStub } from "monaco-editor-wrapper/vscode/services";
// import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'

import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
import '@codingame/monaco-vscode-typescript-language-features-default-extension'

import { ClientWrapper } from '../common/Wrapper'

/**
 * @import {editor} from 'monaco-editor'
 * @import { WrapperConfig, CodePlusUri } from 'monaco-editor-wrapper'
 */

const configureMonacoWorkers = (logger) => {
  useWorkerFactory({
    workerOverrides: {
      ignoreMapping: true,
      workerLoaders: {
        TextEditorWorker: () =>
          new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
            type: 'module'
          }),
        TextMateWorker: () =>
          new Worker(
            new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url),
            { type: 'module' }
          )
      }
    },
    logger
  })
}
const clientSelector = ['js', 'ts', 'jsx'] // ['cpp', 'h', 'c']

/** 基础配置 创建一个编辑器配置
 * @param {string} workspaceRoot 工作区(把项目路径替换`\\`为`/`), eg:`/app1`
 * @param {CodePlusUri} codeFile 初始编辑文件内容
 * @param {editor.IStandaloneEditorConstructionOptions} [editorOption] 编辑器配置
 * @returns {WrapperConfig}
 */
export function createEditorConfig(workspaceRoot = '/', codeFile, editorOption, port = 0) {
  /**@type {WrapperConfig} */
  const config = {
    languageClientConfigs: {
      javascript: {
        languageId: 'javascript',
        name: 'Javascript Client',
        connection: {
          options: {
            $type: 'WebSocketParams',
            host: 'localhost',
            port,
            path: 'js',
            secured: false,
            extraParams: {
              authorization: 'UserAuth'
            },
            startOptions: {
              onCall: (languageClient) => {
                console.log('Connected to socket.')
                // setTimeout(() => {
                //     ['pyright.restartserver', 'pyright.organizeimports'].forEach((cmdName) => {
                //         vscode.commands.registerCommand(cmdName, (...args: unknown[]) => {
                //             languageClient?.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
                //         });
                //     });
                // }, 250);
              },

              reportStatus: true
            },
            stopOptions: {
              onCall: () => {
                console.log('Disconnected from socket.')
              },
              reportStatus: true
            }
          }
        },
        clientOptions: {
          documentSelector: clientSelector,
          workspaceFolder: {
            index: 0,
            name: 'workspace',
            uri: vscode.Uri.file(workspaceRoot /* + '.code-workspace' */)
          },
          initializationOptions: {
            tsserver: {
              path: __TS_SERVER_PATH__,
              // path: 'F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\code-editor\\node_modules\\typescript\\lib\\tsserver.js',
              // trace: 'messages'
              logVerbosity: 'verbose'
            },
            trace: 'messages'
            // rootPath: absRootPath,
            // typescript: {
            //   tsdk: 'F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\code-editor\\node_modules\\typescript\\lib',
            // },
          }
        }
      }
    },
    logLevel: LogLevel.Debug,
    vscodeApiConfig: {
      userServices: {
        // ...getEditorServiceOverride(useOpenEditorStub),
        ...getKeybindingsServiceOverride()
      },
      enableExtHostWorker: true,
      userConfiguration: {
        json: JSON.stringify({
          'workbench.colorTheme': 'Default Dark Modern',
          'typescript.tsserver.web.projectWideIntellisense.enabled': true,
          'typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors': false,
          'diffEditor.renderSideBySide': false,
          'editor.lightbulb.enabled': 'on',
          'editor.glyphMargin': true,
          'editor.guides.bracketPairsHorizontal': true,
          'editor.experimental.asyncTokenization': true
        })
      }
    },
    editorAppConfig: {
      $type: 'extended',
      codeResources: {
        main: codeFile
      },
      useDiffEditor: false,
      monacoWorkerFactory: configureMonacoWorkers,
      editorOptions: Object.assign({}, editorOption),
      htmlContainer: document.getElementById('app')
    }
  }
  return config
}

// 1. 启动服务端
// 2. 创建一个editorwrapper
// 3.
/** 创建一个c语言编辑器
 * @param {string} workspace 工作区(把项目路径去掉工作区再替换`\\`为`/`), eg:`/app1`
 * @param {CodeFile} codeFile 初始编辑文件内容
 * @param {editor.IStandaloneEditorConstructionOptions} [editorOption] 编辑器配置
 */
export async function createEditorWrapper(workspace = '', codeFile, editorOption, port) {
  const config = createEditorConfig(workspace, codeFile, editorOption, port)

  const wrapper = new ClientWrapper()

  await wrapper.init(config)
  return wrapper
}
