import { contextBridge, ipcRenderer } from 'electron';
import { ChannelT } from '../renderer/types/global';
import { channels } from '../renderer/_data';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke(channel: ChannelT, args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
    removeAllListeners: (channel: ChannelT) => {
      if (Object.values(channels).includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
});
