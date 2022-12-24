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
  const BLACKLIST = ['.DS_Store', '1'];

  try {
    const contents = fs
      .readdirSync(path)
      .filter((dirName) => !BLACKLIST.includes(dirName))
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
    const pathSegments = path.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

    fs.renameSync(path, `${trashDir}/${fileToDelete}`);
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

ipcMain.handle(channels.DELETE_FILE, handleDeleteFile);

const handleEmptyTrash = async (
  _e: IpcMainInvokeEvent,
  path: string
): Promise<ResponseT<void>> => {
  try {
    fs.rmSync(`${path}/trash.tmp`, {
      recursive: true,
      force: true
    });
  } catch (error) {
    return error;
  }
};

ipcMain.handle(channels.EMPTY_TRASH, handleEmptyTrash);
