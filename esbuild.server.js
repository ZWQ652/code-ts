/*
 * @Author: zwq
 * @Date: 2024-10-10 09:13:05
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-21 14:05:41
 * @Description:
 */
import * as esbuild from 'esbuild'
import { cp } from 'fs/promises'
import path from 'path'

const outDir = 'build/server'
// const outDir = '../../H.ToolRelease/tools/environment/lsp_server'

await esbuild.build({
  // target:'node10.4',
  platform: 'node',
  entryPoints: ['src/server/index.js'],
  bundle: true,
  minify: true,
  outfile: path.join(outDir, 'index.cjs')
  // outfile:path.join(outDir, 'index.js')
})

await cp('src/server/typescript.js', path.join(outDir, 'tsLsp.js'))
