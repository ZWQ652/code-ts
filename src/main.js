/*
 * @Author: zwq
 * @Date: 2024-09-26 11:43:21
 * @LastEditors: zwq
 * @LastEditTime: 2024-10-09 21:09:10
 * @Description:
 */
import './style.css'
import { EditorWrapper } from './editor'

const options = {
  cwd: __SERVER_PATH__, //'F:\\company-projects\\UITool\\H.ToolRelease\\workspace\\Application4'
  port: 30002,
  editorOptions: {}
}

window.EdiotrWrapper = EditorWrapper

EditorWrapper.createWrapper(options)
// EditorWrapper.createWrapper(options).then((wrapper) => {
//   window.wrapper = wrapper

//   // findService(wrapper.getEditor()._instantiationService)
// })

// function findService(instant = {}, inx = 0) {
//   if (instant._services) {
//     const services = [...instant._services._entries.values()]
//     services.forEach((service, i) => {
//       const props = Object.getPrototypeOf(service)
//       if (props && 'createModelReference' in props) {
//         console.log('textModelService', { service, i, inx })
//         service.createModelReference = (...args) => {
//           console.log('textModelService-createModelReference:', args)
//         }
//       }
//     })
//   }
//   if (instant._parent) {
//     findService(instant._parent, inx++)
//   }
// }
