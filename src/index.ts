const remote = require("electron"),
  app = remote.app,
  BrowserWindow = remote.BrowserWindow,
  nativeImage = remote.nativeImage,
  ejse = require("ejs-electron");

// Create the browser window.
function createWindow() {
  let win = new BrowserWindow({
    backgroundColor: '#FFF', // Add this new line
    width: 1200,
    height: 750,
    // frame: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  // win.setIcon(
  //     nativeImage.createFromPath(
  //         path.join(__dirname, "/icons/png/icon.png")
  //     )
  // );
  //win.webContents.openDevTools();
  // win.loadURL("https://google.com");
  win.loadFile("../WTM-VIEWS/view-home.ejs"); // test.js per le finestre con sessioni diversa
  win.setMenuBarVisibility(false);

  win.setResizable(true);
  win.on("closed", () => {
    app.quit();
  });
}
app.commandLine.appendSwitch('allow-file-access-from-files');
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
