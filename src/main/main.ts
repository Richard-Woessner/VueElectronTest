import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';
import * as fs from 'fs';

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
});

ipcMain.on("get-file", (event, path) => {
  console.log(path);

  fs.readFile(path, "utf-8", (err, data) => {
    console.log(data);

    if (err) {
      event.reply("get-file-response", err.message);
      return;
    }

    event.reply("get-file-response", data);
  });

  // Set up a file listener
  fs.watch(path, (eventType, filename) => {
    console.log(`File ${filename} changed! Event type: ${eventType}`);
    // You can read the file and send its new contents to the renderer process here

    fs.readFile(path, "utf-8", (err, data) => {
      console.log(data);

      if (err) {
        event.reply("get-file-response", err.message);
        return;
      }

      event.reply("get-file-response", data);
    });

  });
});

ipcMain.on("watch-file", (event, path) => {
  fs.watch(path, (eventType, filename) => {
    event.reply("watch-file-change", eventType, filename);
  });
});