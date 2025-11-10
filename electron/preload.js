"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
/**
 * The preload script runs before the renderer process is loaded. It has access
 * to both node and electron APIs. Here we expose a limited API to the
 * renderer via the `contextBridge` so that the renderer can invoke native
 * dialogs and kick off exports without having full access to Node.js.
 */
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    /** Prompt the user to select a video file and return its path. */
    openVideo: () => electron_1.ipcRenderer.invoke('dialog:openVideo'),
    /** Prompt the user to choose an output directory and return its path. */
    chooseOutputDir: () => electron_1.ipcRenderer.invoke('dialog:chooseOutputDir'),
    /** Trigger an export operation for a clip. */
    exportClip: (sourcePath, clip) => electron_1.ipcRenderer.invoke('export:clip', { sourcePath, clip }),
});
