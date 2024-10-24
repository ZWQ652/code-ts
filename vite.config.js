/*
 * @Author: zwq
 * @Date: 2024-09-26 11:10:14
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-24 09:49:19
 * @Description:
 */
import { defineConfig } from 'vite'
import path from 'node:path'
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin'

export default defineConfig((command, mode) => {
  const isBuild = command === 'build'

  return {
    base: './',
    define: {
      // 全局声明
      __SERVER_PATH__: JSON.stringify(isBuild ? '' : path.resolve('./src/server')),
      __TS_SERVER_PATH__: JSON.stringify(
        isBuild ? '' : path.resolve('./node_modules/typescript/lib')
      )
    },
    optimizeDeps: {
      // exclude: ['monaco-editor-wrapper/dist/workers/editorWorker-es.js'],
      esbuildOptions: {
        plugins: [importMetaUrlPlugin]
      }
    },
    // build: {
    //   lib: {
    //     entry: './lib/main.js',
    //     name: 'Counter',
    //     fileName: 'counter'
    //   }
    // }
    build: {
      // outDir: 'build',
      outDir: '../../1.UI设计工具/public/code-editor',
      emptyOutDir: true,
      reportCompressedSize: false,
      sourcemap: false,

      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name].js', //关哈希
          entryFileNames: 'assets/js/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          // assetFileNames: 'assets/[ext]/[name].[ext]',
          manualChunks(id /* , { getModuleIds, getModuleInfo } */) {
            // console.log(id, getModuleIds, getModuleInfo);
            if (id.includes('node_modules')) return 'vendor'
            // if()
            return 'index'
          }
        }
      }
      /*  terserOptions: {
       compress: {
         // warnings: false,
         drop_console: true,  //打包时删除console
         drop_debugger: true, //打包时删除 debugger
         pure_funcs: ['console.log'],
       },
       output: {
         // 去掉注释内容
         comments: true,
       },
     }, */
    },
    worker: {
      format: 'es'
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: 'assets/worker/[name].js', //关哈希
      //     entryFileNames: 'assets/worker/[name].js',
      //     assetFileNames: 'assets/worker/[name].[ext]'
      //   }
      // }
    }
  }
})
