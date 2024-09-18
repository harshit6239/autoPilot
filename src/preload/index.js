import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation is not enabled')
}

try {
  contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      console.log('hello')
      ipcRenderer.send(channel, data)
    },
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
  })
} catch (error) {
  console.error(error)
}
