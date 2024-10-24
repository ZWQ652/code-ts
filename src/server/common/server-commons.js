import { URL } from 'node:url'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'
import express from 'express'
import { WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import { createConnection, createServerProcess, forward } from 'vscode-ws-jsonrpc/server'
import { Message, InitializeRequest } from 'vscode-languageserver'

/**
 * @import {WebSocketServer, ServerOptions} from 'ws';
 * @import {Server} from 'node:http';
 * @import {IWebSocket} from 'vscode-ws-jsonrpc';
 * @import {SpawnOptions} from 'child_process';
 * @import {InitializeParams } from 'vscode-languageserver'
 */

export const LanguageName = {
  /** https://nodejs.org/api/cli.html  */
  node: 'node',
  /** https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html */
  java: 'java'
}

/** LSP server runner
 *
 * @param {LanguageServerRunConfig} languageServerRunConfig
 */
export const runLanguageServer = async (languageServerRunConfig) => {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err.toString())
    if (err.stack !== undefined) {
      console.error(err.stack)
    }
  })

  // create the express application
  const app = express()
  // server the static content, i.e. index.html
  const dir = process.cwd() // getLocalDirectory(import.meta.url)
  console.log('dir:', dir)
  app.use(express.static(dir))

  // start the http server
  let port = 30002
  let httpServer
  // 检测端口是否被占用
  function portIsOccupied(port) {
    return new Promise((resolve, reject) => {
      // 创建服务并监听该端口
      const server = app.listen(port)

      server.on('listening', function () {
        // 执行这块代码说明端口未被占用
        resolve(server)
      })

      server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
          // 端口已经被使用
          reject(err)
        }
      })
    })
  }

  while (true) {
    try {
      httpServer = await portIsOccupied(port)
      break
    } catch (error) {
      port++
    }
  }
  if (process.send) {
    process.send({ type: 'serverPort', port })
  } else {
    console.log('serverPort:', port)
  }
  const wss = new WebSocketServer(languageServerRunConfig.wsServerOptions)
  // create the web socket
  upgradeWsServer(languageServerRunConfig, {
    server: httpServer,
    wss
  })
}

/**
 * @typedef LanguageServerRunConfig
 * @property {string} serverName
 * @property {string} pathName
 * @property {number} serverPort
 * @property {'node'|'java'} runCommand
 * @property {string[]} runCommandArgs
 * @property {ServerOptions} wsServerOptions
 * @property {SpawnOptions} spawnOptions
 */

/**
 * start the language server inside the current process
 * @param {LanguageServerRunConfig} runconfig
 * @param {IWebSocket} socket
 */
export const launchLanguageServer = (runconfig, socket) => {
  const { serverName, runCommand, runCommandArgs, spawnOptions } = runconfig
  // start the language server as an external process
  const reader = new WebSocketMessageReader(socket)
  const writer = new WebSocketMessageWriter(socket)
  const socketConnection = createConnection(reader, writer, () => socket.dispose())
  const serverConnection = createServerProcess(serverName, runCommand, runCommandArgs, spawnOptions)
  console.log('launch: ', JSON.stringify(runconfig, null, 2))
  if (serverConnection) {
    forward(socketConnection, serverConnection, (message) => {
      if (Message.isRequest(message)) {
        console.log(`${serverName} Server received:`)
        if (message.method === InitializeRequest.type.method) {
          /**@type {InitializeParams} */
          const initializeParams = message.params
          initializeParams.processId = process.pid
          // initializeParams.trace = 'messages'
        }
        console.log(message)
      }
      if (Message.isResponse(message)) {
        console.log(`${serverName} Server sent:`)
        console.log(message)
      }
      return message
    })
  }
}

/**
 *
 * @param {LanguageServerRunConfig} runconfig
 * @param {({server: Server, wss: WebSocketServer})} config
 */
export const upgradeWsServer = (runconfig, config) => {
  config.server.on('upgrade', (request, socket, head) => {
    const baseURL = `http://${request.headers.host}/`
    const pathName = request.url !== undefined ? new URL(request.url, baseURL).pathname : undefined
    console.log('URL:', baseURL, pathName)
    if (pathName === runconfig.pathName) {
      config.wss.handleUpgrade(request, socket, head, (webSocket) => {
        /**@type {IWebSocket} */
        const socket = {
          send: (content) =>
            webSocket.send(content, (error) => {
              if (error) {
                throw error
              }
            }),
          onMessage: (cb) =>
            webSocket.on('message', (data) => {
              console.log('message:', data.toString())
              cb(data)
            }),
          onError: (cb) => webSocket.on('error', cb),
          onClose: (cb) => webSocket.on('close', cb),
          dispose: () => webSocket.close()
        }
        // launch the server when the web socket is opened
        if (webSocket.readyState === webSocket.OPEN) {
          launchLanguageServer(runconfig, socket)
        } else {
          webSocket.on('open', () => {
            launchLanguageServer(runconfig, socket)
          })
        }
      })
    }
  })
}

/**
 * Solves: __dirname is not defined in ES module scope
 * @param {string | URL} referenceUrl
 */
export const getLocalDirectory = (referenceUrl) => {
  const __filename = fileURLToPath(referenceUrl)
  return dirname(__filename)
}
