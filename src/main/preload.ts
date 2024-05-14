import {contextBridge, ipcRenderer} from 'electron';
import { get } from 'http';

export interface ElectronApi {
  sendMessage: (message: string) => void;
  getFile: (path: string) => Promise<string>;
  onFileChange: (path: string, listener: (eventType: string, filename: string) => void) => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),

  getFile: (path: string) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('get-file', path);
      ipcRenderer.once('get-file-response', (event, content) => {
        resolve(content);
      });
    });
  },

  onFileChange: (path: string, listener: (eventType: string, filename: string) => void) => {
    ipcRenderer.send("watch-file", path);
    ipcRenderer.on("watch-file-change", (event, eventType, filename) => {
      listener(eventType, filename);
    });

    // Return a cleanup function
    return () => {
      ipcRenderer.removeAllListeners("watch-file-change");
    };
  }
})
