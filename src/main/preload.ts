import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChannelT } from '../renderer/types/global';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: ChannelT, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: ChannelT, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ChannelT, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  }
});
