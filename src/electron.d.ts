export interface Clip {
  id: string;
  name: string;
  inSeconds: number;
  outSeconds: number;
}

export interface ElectronAPI {
  openVideo: () => Promise<string | null>;
  getVideoURL: (filePath: string) => Promise<string>;
  chooseOutputDir: () => Promise<string | null>;
  exportClip: (sourcePath: string, clip: Clip) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
