const url = require('url');
const path = require('path');
const { app, protocol, BrowserWindow } = require('electron');

require('./routes');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'right' });
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }
}

// setup a local proxy to adjust the paths of requested files when loading them from the local production bundle
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(8);
      callback({
        path: path.normalize(`${__dirname}/${url}`)
      });
    },
    (error) => {
      if (error) console.error('Failed to register protocol', error);
    }
  );
}

app.whenReady().then(() => {
  createWindow();

  setupLocalFilesNormalizerProxy();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// restrict navigation to known domains for better security
const NAV_ALLOW_LIST = ['https://image-reviewer-gui.com'];
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (e, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!NAV_ALLOW_LIST.includes(parsedUrl.origin)) {
      e.preventDefault();
    }
  });
});
