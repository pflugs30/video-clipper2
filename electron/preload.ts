import { contextBridge, ipcRenderer } from "electron";

interface Clip {
  id: string;
  name: string;
  inSeconds: number;
  outSeconds: number;
}

/**
 * The preload script runs before the renderer process is loaded. It has access
 * to both node and electron APIs. Here we expose a limited API to the
 * renderer via the `contextBridge` so that the renderer can invoke native
 * dialogs and kick off exports without having full access to Node.js.
 */

console.log("Preload script is running!");

contextBridge.exposeInMainWorld("electronAPI", {
  /** Prompt the user to select a video file and return its path. */
  openVideo: (): Promise<string | null> => ipcRenderer.invoke("dialog:openVideo"),
  /** Convert a local file path to a video URL that can be loaded in the renderer. */
  getVideoURL: (filePath: string): Promise<string> => ipcRenderer.invoke("video:getURL", filePath),
  /** Prompt the user to choose an output directory and return its path. */
  chooseOutputDir: (): Promise<string | null> => ipcRenderer.invoke("dialog:chooseOutputDir"),
  /** Trigger an export operation for a clip. */
  exportClip: (sourcePath: string, clip: Clip): Promise<boolean> =>
    ipcRenderer.invoke("export:clip", { sourcePath, clip }),
  /** Prompt the user to select a project file to open and return its path. */
  openProject: (): Promise<string | null> => ipcRenderer.invoke("dialog:openProject"),
  /** Prompt the user to choose where to save a project file and return its path. */
  saveProject: (): Promise<string | null> => ipcRenderer.invoke("dialog:saveProject"),
  /** Read a project file from disk and return its contents. */
  readProject: (filePath: string) => ipcRenderer.invoke("file:readProject", filePath),
  /** Write project data to a file on disk. */
  writeProject: (filePath: string, data: string) => ipcRenderer.invoke("file:writeProject", filePath, data),
  /** Check if a file exists at the given path. */
  fileExists: (filePath: string): Promise<boolean> => ipcRenderer.invoke("file:exists", filePath),
});

console.log("electronAPI exposed to window");
