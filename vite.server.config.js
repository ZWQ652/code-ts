/*
 * @Author: zwq
 * @Date: 2024-09-26 14:19:31
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-09 09:11:53
 * @Description:
 */
import { defineConfig } from 'vite'

export default defineConfig({
  // plugins: [externals()],
  publicDir: 'serverpub',
  ssr: {
    // target: 'node',
    // noExternal: true
    noExternal: [
      //   'express',
      //   'ws',
      //   'bufferutil',
      'vscode-ws-jsonrpc',
      'vscode-languageserver',
      'vscode-ws-jsonrpc/server'
    ]
  },
  build: {
    ssr: 'src/server/index.js',
    // commonjsOptions: {
    //   // include:['node']
    //   dynamicRequireTargets: [
    //     // include using a glob pattern (either a string or an array of strings)
    //     'node_modules/ws/**/*.js',
    //     'node_modules/express/**/*.js'

    //     // exclude files that are known to not be required dynamically, this allows for better optimizations
    //     // '!@codingame*/**/*.js',
    //     // '!monaco'
    //     // '!node_modules/logform/index.js',
    //     // '!node_modules/logform/format.js',
    //     // '!node_modules/logform/levels.js',
    //     // '!node_modules/logform/browser.js'
    //   ]
    // },
    // lib: {
    //   entry: path.resolve(__dirname, 'src/server/index.js'),
    //   name: 'cpp-server',
    //   fileName: () => 'index.js',
    //   formats: ['es']
    // },
    outDir: '../../H.ToolRelease/tools/environment/lsp_server', //'../code-server',
    emptyOutDir: false,
    // copyPublicDir: false,
    sourcemap: false,
    // minify: true,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js', //关哈希
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
        name: 'cpp-server',
        exports: 'named'
      }
    }
  },
  resolve: {
    dedupe: ['vscode']
  }
})
