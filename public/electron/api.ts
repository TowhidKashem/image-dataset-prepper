const fs = require('fs');
const { ipcMain } = require('electron');

module.exports = () => {
  ipcMain.on('get_all_images', async (event, args) => {
    try {
      const images = fs.readdirSync(args.directory);
      event.reply('get_all_images', images);
    } catch (error) {
      event.reply('get_all_images', {
        error,
        directory: args.directory
      });
    }
  });

  ipcMain.on('get_image', async (event, args) => {
    try {
      const file = args.directory + '/' + args.filename;
      const image = fs.readFileSync(file);

      event.reply('get_image', image.toString('base64'));
    } catch (error) {
      event.reply('get_all_images', error);
    }
  });

  ipcMain.on('delete_image', async (event, args) => {
    try {
      const file = args.directory + '/' + args.filename;
      fs.unlinkSync(file);

      event.reply('delete_image', { success: true });
    } catch (error) {
      event.reply('delete_image', {
        success: false,
        error
      });
    }
  });
};
