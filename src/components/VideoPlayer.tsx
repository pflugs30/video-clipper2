import React, { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import { useProjectStore } from '../state/projectStore';

interface VideoPlayerProps {
  /** The absolute file path of the video to play. */
  source: string;
}

/**
 * A wrapper around the video.js player. It listens for keyboard shortcuts to
 * mark in/out points and add clips. When the `source` prop changes, the
 * video is reloaded into the player. Cleanup disposes of the player to
 * avoid memory leaks.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const projectStore = useProjectStore();

  // Initialise the video.js player and load the source when it changes.
  useEffect(() => {
    if (!playerRef.current && videoNode.current) {
      playerRef.current = videojs(videoNode.current, {
        controls: true,
        preload: 'auto',
        fluid: true,
      });
    }
    if (playerRef.current) {
      playerRef.current.src({ src: source, type: 'video/mp4' });
    }
    // Clean up the player when the component unmounts.
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [source]);

  /**
   * Handle keyboard shortcuts globally for marking in, marking out, and adding a clip.
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    const player = playerRef.current;
    if (!player) return;
    if (e.key === 'i' || e.key === 'I') {
      projectStore.markIn(player.currentTime());
    } else if (e.key === 'o' || e.key === 'O') {
      projectStore.markOut(player.currentTime());
    } else if (e.key === 'a' || e.key === 'A') {
      projectStore.addClipFromMarks();
    }
  };

  // Attach/detach the keyboard listener on mount/unmount.
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;