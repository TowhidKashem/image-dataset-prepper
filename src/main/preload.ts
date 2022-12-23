import { contextBridge, ipcRenderer } from 'electron';
import { ChannelT } from '../renderer/global';
import { channels } from '../renderer/_data';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke<T>(channel: ChannelT, args: T) {
      return ipcRenderer.invoke(channel, args);
    },
    removeAllListeners: (channel: ChannelT) => {
      if (Object.values(channels).includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
});
