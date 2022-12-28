import { contextBridge, ipcRenderer } from 'electron';
import { ChannelT } from '../renderer/global';

contextBridge.exposeInMainWorld('app', {
  ipcRenderer: {
    invoke<T>(channel: ChannelT, args: unknown): Promise<T> {
      return ipcRenderer.invoke(channel, args);
    }
  },
  openDialogPicker() {
    ipcRenderer.send('open-picker-dialog');
  },
  onDialogPickerResult(
    callback: (result: Electron.OpenDialogReturnValue) => void
  ) {
    ipcRenderer.on(
      'dialog-picker-result',
      (_e, result: Electron.OpenDialogReturnValue) => {
        callback(result);
      }
    );
  }
});
