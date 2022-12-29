import fs from 'fs';
import path from 'path';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { channels } from '../renderer/_data';

const TRASH_DIR = '_trash';
const PICKED_DIR = '_picked';

const handleListDirectory = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<DirContentT[]>> => {
  const BLOCK_LIST = ['1', '.DS_Store', TRASH_DIR, PICKED_DIR];

  try {
    const contents = fs
      .readdirSync(filePath)
      .filter(
        (dirName) => !BLOCK_LIST.includes(dirName) && !dirName.startsWith('.')
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

    const trashDir = `${parentDir}/${TRASH_DIR}`;

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

    const trashDir = `${parentDir}/${TRASH_DIR}`;

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
    const TRASH_DIR_PATH = `/${filePath}/${TRASH_DIR}`;

    if (fs.existsSync(TRASH_DIR_PATH)) {
      fs.rmSync(TRASH_DIR_PATH, {
        recursive: true,
        force: true
      });
    }

    return { error: null };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleMoveFile = async (
  _e: IpcMainInvokeEvent,
  filePath: string
): Promise<ResponseT<void>> => {
  try {
    const pathSegments = filePath.split('/');

    const fileToMove = pathSegments.pop();

    const parentDir = pathSegments.join('/');

    const pickedDir = `${parentDir}/${PICKED_DIR}`;

    if (!fs.existsSync(pickedDir)) fs.mkdirSync(pickedDir);

    fs.renameSync(filePath, `${pickedDir}/${fileToMove}`);

    return { error: null };
  } catch (error) {
    return {
      error: new Error(error as string)
    };
  }
};

const handleGetPickedCount = async (
  _e: IpcMainInvokeEvent,
  dirPath: string
): Promise<ResponseT<number>> => {
  try {
    const PICKED_DIR_PATH = `${dirPath}/${PICKED_DIR}`;

    const pickedCount = fs.existsSync(PICKED_DIR_PATH)
      ? fs.readdirSync(PICKED_DIR_PATH).length
      : 0;

    return {
      data: pickedCount,
      error: null
    };
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

ipcMain.handle(channels.MOVE_FILE, handleMoveFile);
ipcMain.handle(channels.GET_PICKED_COUNT, handleGetPickedCount);
