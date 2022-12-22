import { ipcMain } from 'electron';
import { getSubfolders, getImages, deleteImage } from './handlers';
import { channels } from '../renderer/_data';

ipcMain.on(channels.GET_SUB_FOLDERS, getSubfolders);
ipcMain.on(channels.GET_IMAGES, getImages);
ipcMain.on(channels.DELETE_IMAGE, deleteImage);
