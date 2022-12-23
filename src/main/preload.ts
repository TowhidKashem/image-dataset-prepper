import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChannelT } from '../renderer/types/global';
import { channels } from '../renderer/_data';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: ChannelT, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: ChannelT, func: (...args: unknown[]) => void) {
      const subscription = (e: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);

      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ChannelT, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (e, ...args) => func(...args));
    },
    removeAllListeners: (channel: ChannelT) => {
      if (Object.values(channels).includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
});
