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
contextBridge.exposeInMainWorld("electronAPI", {
  /** Prompt the user to select a video file and return its path. */
  openVideo: (): Promise<string | null> => ipcRenderer.invoke("dialog:openVideo"),
  /** Prompt the user to choose an output directory and return its path. */
  chooseOutputDir: (): Promise<string | null> => ipcRenderer.invoke("dialog:chooseOutputDir"),
  /** Trigger an export operation for a clip. */
  exportClip: (sourcePath: string, clip: Clip): Promise<boolean> =>
    ipcRenderer.invoke("export:clip", { sourcePath, clip }),
});
