const { ipcMain } = require('electron');
const { getSubfolders, getImages, deleteImage } = require('./handlers');
const { GET_SUB_FOLDERS, GET_IMAGES, DELETE_IMAGE } = require('./_data');

ipcMain.on(GET_SUB_FOLDERS, getSubfolders);
ipcMain.on(GET_IMAGES, getImages);
ipcMain.on(DELETE_IMAGE, deleteImage);
