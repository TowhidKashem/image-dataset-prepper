const { ipcMain } = require('electron');
const { GET_FOLDER_CONTENTS, GET_IMAGE, DELETE_IMAGE } = require('./_data');
const { getFolderContents, getImage, deleteImage } = require('./handlers');

ipcMain.on(GET_FOLDER_CONTENTS, getFolderContents);
ipcMain.on(GET_IMAGE, getImage);
ipcMain.on(DELETE_IMAGE, deleteImage);
