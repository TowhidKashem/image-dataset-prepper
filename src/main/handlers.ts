import fs from 'fs';
import path from 'path';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { channels, EnvVarsT } from '../renderer/_data';

const handleGetEnvVars = async (): Promise<ResponseT<EnvVarsT>> => ({
  data: {
    PROJECT_ROOT: path.resolve(__dirname, '../../')
  }
});

ipcMain.handle(channels.GET_ENV_VARS, handleGetEnvVars);

const handleListDirectory = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<string[]>> => {
  try {
    const contents = fs
      .readdirSync(path)
      .map((dirName) => `${path}/${dirName}`);

    return {
      data: contents,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: new Error(error as string)
    };
  }
};

ipcMain.handle(channels.LIST_DIR, handleListDirectory);

const handleDeleteFile = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<void>> => {
  try {
    // fs.unlinkSync(path);
  } catch (error) {
    return error;
  }
};

ipcMain.handle(channels.DELETE_FILE, handleDeleteFile);
