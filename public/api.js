const fs = require('fs');
const { ipcMain } = require('electron');

const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
const GET_IMAGE = 'GET_IMAGE';
const DELETE_IMAGE = 'DELETE_IMAGE';

ipcMain.on(GET_ALL_IMAGES, async (event, args) => {
  try {
    const images = fs.readdirSync(args.directory);
    event.reply(GET_ALL_IMAGES, images);
  } catch (error) {
    event.reply(GET_ALL_IMAGES, {
      error,
      directory: args.directory
    });
  }
});

ipcMain.on(GET_IMAGE, async (event, args) => {
  try {
    const file = args.directory + '/' + args.filename;
    const image = fs.readFileSync(file);

    event.reply(GET_IMAGE, image.toString('base64'));
  } catch (error) {
    event.reply(GET_IMAGE, error);
  }
});

ipcMain.on(DELETE_IMAGE, async (event, args) => {
  try {
    const file = args.directory + '/' + args.filename;
    fs.unlinkSync(file);

    event.reply(DELETE_IMAGE, { success: true });
  } catch (error) {
    event.reply(DELETE_IMAGE, {
      success: false,
      error
    });
  }
});
