/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './_utils';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

require('./routes');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      // nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  new AppUpdater(); // eslint-disable-line no-new
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// const url = require('url');
// const path = require('path');
// const { app, protocol, BrowserWindow } = require('electron');

// require('./routes');

// const isDev = process.env.NODE_ENV === 'development';

// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 800,
//     icon: path.join(__dirname, 'icon.png'),
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       webSecurity: false,
//       nodeIntegration: true
//     }
//   });

//   if (!isDev) {
//     mainWindow.loadURL('http://localhost:3000');
//     mainWindow.webContents.openDevTools({ mode: 'right' });
//   } else {
//     mainWindow.loadURL(
//       url.format({
//         pathname: path.join(__dirname, 'index.html'),
//         protocol: 'file',
//         slashes: true
//       })
//     );
//   }
// }

// setup a local proxy to adjust the paths of requested files when loading them from the local production bundle
// function setupLocalFilesNormalizerProxy() {
//   protocol.registerHttpProtocol(
//     'file',
//     (request, callback) => {
//       const url = request.url.substr(8);
//       callback({
//         path: path.normalize(`${__dirname}/${url}`)
//       });
//     },
//     (error) => {
//       if (error) console.error('Failed to register protocol', error);
//     }
//   );
// }

// app.whenReady().then(() => {
//   createWindow();

//   setupLocalFilesNormalizerProxy();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// restrict navigation to known domains for better security
// const NAV_ALLOW_LIST = ['https://image-reviewer-gui.com'];
// app.on('web-contents-created', (_, contents) => {
//   contents.on('will-navigate', (e, navigationUrl) => {
//     const parsedUrl = new URL(navigationUrl);

//     if (!NAV_ALLOW_LIST.includes(parsedUrl.origin)) {
//       e.preventDefault();
//     }
//   });
// });
