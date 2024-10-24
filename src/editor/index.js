/*
 * @Author: zwq
 * @Date: 2024-09-26 11:45:58
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-24 09:57:20
 * @Description:
 */
// import { createEditorWrapper } from './lang/ClientCpp'
import { createEditorWrapper } from './lang/Client'
import text from '../server/index.js?raw'

export const EditorWrapper = {
  createWrapper: async function (options) {
    const workspace = options.cwd.split('\\').slice(1).join('/')

    const wrapper = await createEditorWrapper(
      workspace,
      options.codeFile || {
        uri: workspace + '/index.js', // '/test.js', // '/event.c',
        text
      },
      options.editorOptions || {},
      options.port
    )
    await wrapper.start()
    return wrapper
  }
  // wrapperInit().catch((err) => console.error('EditorWrapper:', err))
}
