import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we are running in development or as a packaged app.
const isDev = !app.isPackaged;

/**
 * Create the main application window. During development it loads the Vite dev server,
 * while in production it loads the compiled renderer HTML from the dist folder.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  if (isDev) {
    // Use the Vite dev server URL in development.
    win.loadURL("http://localhost:5173");
    // Open developer tools automatically in development for convenience.
    win.webContents.openDevTools();
  } else {
    // Load the index.html from the packaged bundle in production.
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  /**
   * Prompt the user to select a video file. Returns the selected file path or null if canceled.
   */
  ipcMain.handle("dialog:openVideo", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Video Files", extensions: ["mp4", "mkv", "mov", "avi"] }],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  /**
   * Prompt the user to choose an output directory for exporting clips. Returns the directory path or null if canceled.
   */
  ipcMain.handle("dialog:chooseOutputDir", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  /**
   * Stub for exporting a clip using ffmpeg. In a future version this would spawn ffmpeg
   * with appropriate arguments. For now it logs the command that would run.
   */
  ipcMain.handle("export:clip", async (_event, args) => {
    const { sourcePath, clip } = args;
    const { inSeconds, outSeconds, name } = clip;
    // Clean the clip name for use in a file name.
    const safeName = name.replace(/\s+/g, "_");
    const outputFileName = `${safeName}_${inSeconds.toFixed(2)}-${outSeconds.toFixed(2)}.mp4`;
    const cmdArgs = [
      "-i",
      sourcePath,
      "-ss",
      inSeconds.toString(),
      "-to",
      outSeconds.toString(),
      "-c",
      "copy",
      outputFileName,
    ];
    console.log("Stub export with ffmpeg:", cmdArgs.join(" "));
    // Example of how you might spawn ffmpeg in a real implementation:
    // const ffmpeg = spawn('ffmpeg', cmdArgs);
    // ffmpeg.on('close', (code) => {
    //   console.log(`ffmpeg process exited with code ${code}`);
    // });
    return true;
  });

  // On macOS it's common to recreate a window when the dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the app once all windows have been closed, except on macOS where it is common
// for applications to stay open until the user explicitly quits.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
