import * as monaco from 'monaco-editor'
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper'
// import * as vscode from 'vscode'
// import {
//   RegisteredFileSystemProvider,
//   registerFileSystemOverlay,
//   RegisteredMemoryFile
// } from '@codingame/monaco-vscode-files-service-override'

// function loadFileSystem() {
//   const fileSystemProvider = new RegisteredFileSystemProvider(false)
//   // fileSystemProvider.registerFile(new RegisteredMemoryFile(workspace, ''))
//   registerFileSystemOverlay(1, fileSystemProvider)
//   return fileSystemProvider
// }
// export const MemoryFileManage = {
//   fileSystem: loadFileSystem(),
//   loadFile: function (Url = '', content = '') {
//     return this.fileSystem.registerFile(new RegisteredMemoryFile(vscode.Uri.file(Url), content))
//   },
//   deleteFile: function (Url = '') {
//     return this.fileSystem.delete(vscode.Uri.file(Url))
//   }
// }
window.monaco = monaco
export const ClientWrapper = MonacoEditorLanguageClientWrapper
