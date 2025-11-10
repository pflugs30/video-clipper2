export interface Clip {
  id: string;
  name: string;
  inSeconds: number;
  outSeconds: number;
}

export interface FileResult {
  success: boolean;
  content?: string;
  error?: string;
}

export interface ElectronAPI {
  openVideo: () => Promise<string | null>;
  getVideoURL: (filePath: string) => Promise<string>;
  chooseOutputDir: () => Promise<string | null>;
  exportClip: (sourcePath: string, clip: Clip) => Promise<boolean>;
  // Project file operations
  openProject: () => Promise<string | null>;
  saveProject: () => Promise<string | null>;
  readProject: (filePath: string) => Promise<FileResult>;
  writeProject: (filePath: string, data: string) => Promise<FileResult>;
  fileExists: (filePath: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
