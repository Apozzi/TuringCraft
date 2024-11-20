import { app, BrowserWindow } from 'electron';
import * as remote from '@electron/remote/main';

remote.initialize();


app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Turing Craft',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

    //Menu.setApplicationMenu(null);

  remote.enable(win.webContents);

  // Rest of your existing code remains the same
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html');
  }

  win.maximize();
})

