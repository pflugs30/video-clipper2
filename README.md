# Video Clipper v0.1 Skeleton

This repository contains a minimal starting point for a desktop video clipping tool built with Electron, React, and Vite.  It is designed to let you quickly open a video, set in/out points, create a list of clips, and stub out exporting those clips via ffmpeg.  The goal of this skeleton is to provide a clear architecture and some basic UI components so you can iterate towards a full‑featured application.

## Features

- **Open Video** – Select a local video file using a native file dialog and load it into the player.
- **Mark In/Out** – Use keyboard shortcuts (`i` to mark In, `o` to mark Out) or the buttons in the UI to set the start and end for a clip.
- **Add Clip** – Press `a` (or click the "Add Clip" button) to store a clip based on the current in/out points.  Clips appear in a table with their timings.
- **Clear Marks** – Press `c` (or click the "Clear Marks" button) to clear the current in/out points without adding a clip.
- **Save/Load Projects** – Save your clips and video source information to a JSON file. Load previously saved projects with validation.
- **Batch Export (Stub)** – Select any number of clips in the table and click "Export Selected Clips."  This skeleton logs the ffmpeg command that would run; integrate your own ffmpeg calls in `electron/main.ts` to make this functional.

## Keyboard Shortcuts

### Clipping Controls
- **i** – Mark In (set start point for clip)
- **o** – Mark Out (set end point for clip)
- **a** – Add Clip (create clip from current in/out marks)
- **c** – Clear Marks (reset in/out points)

### Video Playback Controls
- **Space** – Play/Pause
- **Left Arrow** – Skip backward 5 seconds
- **Right Arrow** – Skip forward 5 seconds
- **Ctrl + Left Arrow** – Skip backward 15 seconds
- **Ctrl + Right Arrow** – Skip forward 15 seconds
- **Shift + Left Arrow** – Decrease playback speed
- **Shift + Right Arrow** – Increase playback speed
- **,** (Comma) – Move one frame backward
- **.** (Period) – Move one frame forward
- **f** – Toggle fullscreen
- **m** – Toggle mute

## Quick Start

This project is a skeleton and does not ship with Node modules. To run it locally, you will need to have Node.js installed. Then:

1. Install dependencies:
   ```sh
   npm install
   ```

2. Run in development mode (recommended - starts both Vite and Electron):
   ```sh
   npm start
   ```
   This will concurrently start the Vite dev server on http://localhost:5173 and launch Electron.

**Alternative manual approach:**

1. Start the Vite dev server for the renderer:
   ```sh
   npm run dev
   ```
2. In another terminal, compile and start Electron:
   ```sh
   npm run electron:dev
   ```

**Production build:**

When you're ready to build a production version:
```sh
npm run build          # Build the React renderer
npm run build:electron # Compile TypeScript for Electron main process
```

Then configure your Electron build pipeline (e.g., electron-builder) accordingly. The main process entry point is `electron/main.ts` (compiled to `electron/main.js`).

## Next Steps

This skeleton intentionally leaves many details open so you can tailor the tool to your needs. Here are a few ideas:

- **Real ffmpeg integration** – Replace the stub in `ipcMain.handle('export:clip', ...)` with a call to spawn ffmpeg. Use the `child_process` module to run ffmpeg with `-ss`, `-to`, and other options to trim the clip.
- **Enhanced UI** – Use Tailwind CSS (if included in your build pipeline) to polish the interface. Add waveform previews, thumbnails, or drag‑and‑drop ordering.
- **Multiple sources** – Allow loading and managing clips from multiple source videos within the same project.
- **yt-dlp integration** – Optionally integrate yt‑dlp to download online videos directly into the app for clipping.

## Future Enhancements / TODOs

- **Auto-save** – Implement periodic auto-saving to prevent data loss. Consider saving to a temporary location and prompting on app close.
- **Relative paths** – Support relative video paths for better project portability when moving files between machines.
- **File relocation** – When a video source is missing, prompt the user to relocate the file instead of blocking the load.
- **Version migration** – Add logic to migrate older project file formats to the current version automatically.
- **Recent projects** – Track recently opened projects for quick access (consider using electron-store or localStorage).
- **Unsaved changes prompt** – Warn users when closing the app or loading a new project with unsaved changes.
- **Better validation** – Use a schema validation library (e.g., Zod) for more robust project file validation.

Feel free to build upon this starting point and adapt it to your workflow.