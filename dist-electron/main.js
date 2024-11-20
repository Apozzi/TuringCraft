import { app as n, BrowserWindow as i, Menu as o } from "electron";
n.whenReady().then(() => {
  const e = new i({
    title: "Turing Craft"
  });
  process.env.VITE_DEV_SERVER_URL ? e.loadURL(process.env.VITE_DEV_SERVER_URL) : e.loadFile("dist/index.html"), o.setApplicationMenu(null), e.maximize();
});
