import * as vscode from 'vscode'
// import { initialize} from 'vscode/services'
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory'
import { useOpenEditorStub } from 'monaco-editor-wrapper/vscode/services'

// import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override'
import getconfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override'
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'

// import '@codingame/monaco-vscode-standalone-languages'
// import '@codingame/monaco-vscode-standalone-typescript-language-features'
import '@codingame/monaco-vscode-theme-defaults-default-extension'
// import '@codingame/monaco-vscode-cpp-default-extension'
import '@codingame/monaco-vscode-json-default-extension'
import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
import '@codingame/monaco-vscode-typescript-language-features-default-extension'
import { ClientWrapper } from '../common/Wrapper'

/**
 * @import {editor} from 'monaco-editor'
 * @import { UserConfig } from 'monaco-editor-wrapper'
 */
/**
 * @typedef CodeFile
 * @property {string} text 文件内容
 * @property {string} uri 文件内容路径(把项目路径去掉工作区再替换`\\`为`/`), eg:`/app1/custom/custom.c`
 */

/** 设置worker */
useWorkerFactory({
  ignoreMapping: false, // true,
  workerLoaders: {
    editorWorkerService: () =>
      new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
        type: 'module'
      })
  }
})

const clientSelector = ['js', 'ts', 'jsx'] // ['cpp', 'h', 'c']
/** 基础配置 创建一个编辑器配置
 * @param {string} workspaceRoot 工作区(把项目路径替换`\\`为`/`), eg:`/app1`
 * @param {CodeFile} codeFile 初始编辑文件内容
 * @param {editor.IStandaloneEditorConstructionOptions} [editorOption] 编辑器配置
 * @returns {UserConfig}
 */
export function createEditorConfig(workspaceRoot = '/', codeFile, editorOption, port = 0) {
  /**@type {UserConfig} */
  const config = {
    wrapperConfig: {
      serviceConfig: {
        userServices: {
          ...getEditorServiceOverride(useOpenEditorStub),
          ...getKeybindingsServiceOverride(),
          ...getconfigurationServiceOverride()
          // ...getModelServiceOverride()
          // ...modelService
        },
        enableExtHostWorker: true,
        debugLogging: true,
        workspaceConfig: {
          workspaceProvider: {
            trusted: true,
            workspace: {
              workspaceUri: vscode.Uri.file(workspaceRoot + '.code-workspace')
            },
            async open() {
              console.warn('workspaceProviderOpen')
              return true
            }
          }
        }
      },
      editorAppConfig: {
        // $type:'classic',
        $type: 'extended',
        codeResources: {
          main: codeFile
        },
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            // 'typescript.tsserver.web.projectWideIntellisense.enabled': true,
            // 'typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors': false,
            'editor.guides.bracketPairsHorizontal': 'active',
            'editor.wordBasedSuggestions': 'off'
          })
        },
        useDiffEditor: false,
        editorOptions: Object.assign({}, editorOption)
      }
    },
    loggerConfig: {
      enabled: true,
      debugEnabled: true
    }
  }
  if (port) {
    config.languageClientConfig = {
      languageId: 'javascript', // 'cpp',
      name: uniqueId(clientSelector[0] + ' client'),
      options: {
        $type: 'WebSocket',
        host: /* '172.16.107.213', */ 'localhost',
        port,
        path: clientSelector[0], // 'js', //'clangd',
        extraParams: {
          authorization: 'UserAuth'
        },
        secured: false,
        startOptions: {
          onCall: (languageClient) => {
            // setTimeout(() => {
            //     ['pyright.restartserver', 'pyright.organizeimports'].forEach((cmdName) => {
            //         vscode.commands.registerCommand(cmdName, (...args: unknown[]) => {
            //             languageClient?.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
            //         });
            //     });
            // }, 250);
          },
          reportStatus: true
        }
      },
      clientOptions: {
        documentSelector: clientSelector,
        workspaceFolder: {
          index: 0,
          name: 'workspace',
          uri: vscode.Uri.file(workspaceRoot)
        },
        initializationOptions: {
          tsserver: {
            // path: 'F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\code-editor\\node_modules\\typescript\\lib\\tsserver.js',
            // trace: 'messages'
            logVerbosity: 'verbose'
          },
          trace: 'messages'
          // rootPath: absRootPath,
          // typescript: {
          //   tsdk: 'F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\monaco-languageclient-main\\packages\\examples\\node_modules\\typescript\\lib',
          // }
        }
      }
    }
    // config.wrapperConfig.serviceConfig.enableExtHostWorker = true
    // config.wrapperConfig.editorAppConfig.$type = 'extended'
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

let inx = 0
function uniqueId(prefix = '') {
  return prefix + inx++
}
