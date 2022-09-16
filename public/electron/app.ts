const fs = require('fs');
const path = require('path');
const {
  app,
  BrowserWindow,
  ipcMain,
  contextBridge,
  ipcRenderer
} = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools({ mode: 'right' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel, args) {
      ipcRenderer.send(channel, args);
    },
    on(channel, func: (...args) => void) {
      const subscription = (_event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel, func: (...args) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  }
});

//*--------------------------------------- endpoints ---------------------------------------*//

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
