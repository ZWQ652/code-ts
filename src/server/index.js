/*
 * @Author: zwq
 * @Date: 2024-09-26 14:20:26
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-24 09:49:15
 * @Description:
 */
import { runServer } from './lang/ts/main.js'
import { resolve } from 'node:path'
import { getLocalDirectory } from './common/server-commons.js'
// import { appendFile } from 'node:fs/promises'
// function writeLog(...args) {
//   appendFile(
//     'F:\\nodejs\\serverLog.txt',
//     args.map((ar) => JSON.stringify(ar, null, 2)).join(' ') + '\r\n',
//     {
//       encoding: 'utf-8'
//     }
//   )
// }
// console.log = (...args) => writeLog(new Date(), ...args)

const baseDir = resolve(getLocalDirectory(import.meta.url))
console.log('processArgv:', baseDir, process.argv)
runServer(
  baseDir
  // 'F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\monaco-languageclient-main-9.0.next\\examples'
)
// runServer('F:\\company-projects\\JLMiniApp\\3.JLScriptTool\\code-editor', 4)
// runServer(process.cwd(), process.argv[2])
