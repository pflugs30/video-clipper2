import React, { useEffect, useRef, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useProjectStore } from "../state/projectStore";

type VideoJsPlayer = ReturnType<typeof videojs>;

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
  const isInitialized = useRef(false);
  const projectStore = useProjectStore();

  // Initialize the video.js player once when component mounts
  useEffect(() => {
    // Make sure video.js player is only initialized once
    if (!isInitialized.current && videoNode.current && videoNode.current.isConnected) {
      isInitialized.current = true;
      playerRef.current = videojs(videoNode.current, {
        controls: true,
        preload: "auto",
        fluid: true,
      });
    }

    // Dispose of the player when component unmounts
    return () => {
      if (playerRef.current && !videoNode.current?.isConnected) {
        playerRef.current.dispose();
        playerRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  // Update source when it changes
  useEffect(() => {
    if (playerRef.current && source) {
      playerRef.current.src({ src: source, type: "video/mp4" });
    }
  }, [source]);

  /**
   * Handle keyboard shortcuts globally for marking in, marking out, and adding a clip.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player) return;
      if (e.key === "i" || e.key === "I") {
        projectStore.markIn(player.currentTime());
      } else if (e.key === "o" || e.key === "O") {
        projectStore.markOut(player.currentTime());
      } else if (e.key === "a" || e.key === "A") {
        projectStore.addClipFromMarks();
      }
    },
    [projectStore]
  );

  // Attach/detach the keyboard listener on mount/unmount.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div data-vjs-player style={{ width: "100%", maxWidth: "960px" }}>
      <video ref={videoNode} className="video-js vjs-big-play-centered" playsInline />
    </div>
  );
};

export default VideoPlayer;
