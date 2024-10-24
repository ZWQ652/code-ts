/*
 * @Author: zwq
 * @Date: 2024-09-12 14:50:57
 * @LastEditors: zwq
 * @LastEditTime: 2024-09-30 16:39:23
 * @Description:
 */
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { runLanguageServer } from '../../common/server-commons'

// import { getLocalDirectory, runLanguageServer } from '../../common/server-commons.js'
// import path from 'node:path'

// const baseDir = path.resolve(getLocalDirectory(import.meta.url))
// console.log(import.meta.url, baseDir)
// const exeDir = 'F:\\nodejs\\LSP\\clangd-windows-18.1.3\\clangd_18.1.3\\bin'
// const exeDir = 'E:\\companyFiles'
export const runServer = (runCommand = 'node', workspace = '', compilePath = '') => {
  // const processRunPath = path.resolve(baseDir, relativeDir);

  const runCommandArgs = []
  if (compilePath) runCommandArgs.push('--compile-commands-dir=' + compilePath)
  runCommandArgs.push('--log=verbose')

  return runLanguageServer({
    serverName: 'Cpp',
    pathName: '/clangd',
    // serverPort: 30002,
    runCommand, //path.join(exeDir, 'clangd.exe'), // LanguageName.node,
    runCommandArgs,
    spawnOptions: {
      //设置进程配置
      cwd: workspace // 'F:\\company-projects\\UITool\\H.ToolRelease\\workspace\\Application4'
    },
    wsServerOptions: {
      noServer: true,
      perMessageDeflate: false,
      clientTracking: true,
      verifyClient: (clientInfo, callback) => {
        const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req.url ?? ''}`)
        const authToken = parsedURL.searchParams.get('authorization')
        if (authToken === 'UserAuth') {
          callback(true)
        } else {
          callback(false)
        }
      }
    }
  })
}
