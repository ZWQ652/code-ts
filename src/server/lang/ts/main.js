/*
 * @Author: zwq
 * @Date: 2024-09-12 14:50:57
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-23 15:39:49
 * @Description:
 */
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { getLocalDirectory, runLanguageServer } from '../../common/server-commons.js'
import path from 'path'

export const runServer = (workspace = '', logLevel) => {
  const serverName = 'typescript-language-server'
  const runCommandArgs = ['--stdio']
  // const command = path.join(getLocalDirectory(import.meta.url), '../../../../lib/index.cjs')
  // const runCommandArgs = [command, '--stdio']
  if (logLevel) {
    // runCommandArgs.push('--log-level')
    // runCommandArgs.push(logLevel)
  }

  return runLanguageServer({
    serverName,
    pathName: '/js',
    runCommand: serverName, // 'node',
    // runCommand: 'node',
    runCommandArgs,
    spawnOptions: {
      //设置进程配置
      cwd: workspace,
      shell: true
    },
    wsServerOptions: {
      noServer: true,
      perMessageDeflate: false,
      clientTracking: true,
      verifyClient: (clientInfo, callback) => {
        const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req.url ?? ''}`)
        const authToken = parsedURL.searchParams.get('authorization')
        if (authToken === 'UserAuth') {
          console.log('auth:', true)
          callback(true)
        } else {
          callback(false)
        }
      }
    }
  })
}
