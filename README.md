# Video Clipper v0.1 Skeleton

This repository contains a minimal starting point for a desktop video clipping tool built with Electron, React, and Vite.  It is designed to let you quickly open a video, set in/out points, create a list of clips, and stub out exporting those clips via ffmpeg.  The goal of this skeleton is to provide a clear architecture and some basic UI components so you can iterate towards a full‑featured application.

## Features

- **Open Video** – Select a local video file using a native file dialog and load it into the player.
- **Mark In/Out** – Use keyboard shortcuts (`i` to mark In, `o` to mark Out) or the buttons in the UI to set the start and end for a clip.
- **Add Clip** – Press `a` (or click the “Add Clip” button) to store a clip based on the current in/out points.  Clips appear in a table with their timings.
- **Batch Export (Stub)** – Select any number of clips in the table and click “Export Selected Clips.”  This skeleton logs the ffmpeg command that would run; integrate your own ffmpeg calls in `electron/main.ts` to make this functional.
- **State Management** – Uses a simple React context to manage clip data.  In this version the data is held in memory; you can extend it to save and load projects.

## Quick Start

This project is a skeleton and does not ship with Node modules. To run it locally, you will need to have Node.js installed. Then:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the Vite dev server for the renderer:
   ```sh
   npm run dev
   ```
   This will start a development server on http://localhost:5173.
3. In another terminal, start Electron with the current directory:
   ```sh
   npx electron .
   ```
   Electron will load the renderer from the Vite dev server.

When you’re ready to build a production version, compile the renderer with `npm run build` and configure your Electron build pipeline accordingly. The main process entry point is `electron/main.ts` (compiled to JavaScript).

## Next Steps

This skeleton intentionally leaves many details open so you can tailor the tool to your needs. Here are a few ideas:

- **Real ffmpeg integration** – Replace the stub in `ipcMain.handle('export:clip', ...)` with a call to spawn ffmpeg. Use the `child_process` module to run ffmpeg with `-ss`, `-to`, and other options to trim the clip.
- **Project persistence** – Save clips and project metadata to a file (e.g. JSON or SQLite). Provide open/save project dialogs.
- **Enhanced UI** – Use Tailwind CSS (if included in your build pipeline) to polish the interface. Add waveform previews, thumbnails, or drag‑and‑drop ordering.
- **Multiple sources** – Allow loading and managing clips from multiple source videos within the same project.
- **yt-dlp integration** – Optionally integrate yt‑dlp to download online videos directly into the app for clipping.

Feel free to build upon this starting point and adapt it to your workflow.

# Video Clipper – v002 (dev‑ready)

This build fixes the Electron entry issue by compiling TypeScript to JS before launch and adds the missing Vite files.

## Quick start

```bash
npm install
# Terminal A – start the Vite renderer
npm run dev
# Terminal B – compile TS and start Electron
npm run start
```

- Dev server: http://localhost:5173
- Electron `main`: `dist/electron/main.js` after `npm run compile`

## Build for prod (renderer only for now)

```bash
npm run build
# Produces dist/renderer/; Electron files compile to dist/electron/
```

## Keyboard

- Space: play/pause (when player focused)
- I: mark In
- O: mark Out
- A: add clip from current in/out
