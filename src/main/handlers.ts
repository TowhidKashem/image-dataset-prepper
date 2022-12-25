import fs from 'fs';
import path from 'path';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { channels } from '../renderer/_data';

const handleListDirectory = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<DirContentT[]>> => {
  const BLACKLIST = ['1', '.DS_Store', 'trash.tmp'];

  try {
    const contents = fs
      .readdirSync(filePath)
      .filter(
        (dirName) => !BLACKLIST.includes(dirName) && !dirName.startsWith('.')
      )
      .map((dirName) => {
        const newFilePath = `${filePath}/${dirName}`;
        const isDir = fs.statSync(newFilePath).isDirectory();

        return {
          name: dirName,
          path: newFilePath,
          extension: !isDir ? path.extname(newFilePath) : null,
          isDir
        };
      });

    return {
      data: contents,
      error: null
    };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleDeleteFile = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = filePath.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

    fs.renameSync(filePath, `${trashDir}/${fileToDelete}`);

    return { error: null };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleUndoDeleteFile = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = filePath.split('/');

    const fileToDelete = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const trashDir = `${parentDir}/trash.tmp`;

    fs.renameSync(`${trashDir}/${fileToDelete}`, filePath);

    return { error: null };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleEmptyTrash = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    fs.rmSync(`${filePath}/trash.tmp`, {
      recursive: true,
      force: true
    });

    return { error: null };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

// endpoints
ipcMain.handle(channels.LIST_DIR, handleListDirectory);
ipcMain.handle(channels.DELETE_FILE, handleDeleteFile);
ipcMain.handle(channels.UNDO_DELETE, handleUndoDeleteFile);
ipcMain.handle(channels.EMPTY_TRASH, handleEmptyTrash);
