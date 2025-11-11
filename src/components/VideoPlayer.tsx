import React, { useEffect, useRef, useCallback, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useProjectStore } from "../state/projectStore";
import { formatTimestamp } from "../utils/timeFormat";

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
  const [localPlaybackSpeed, setLocalPlaybackSpeed] = useState<number>(1.0);

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

      // Update current time in the store as video plays
      const updateTime = () => {
        if (playerRef.current) {
          const time = playerRef.current.currentTime();
          if (typeof time === "number") {
            projectStore.setCurrentTime(time);
          }
        }
      };
      playerRef.current.on("timeupdate", updateTime);

      // Update playback speed in the store when it changes
      const updateSpeed = () => {
        if (playerRef.current) {
          const speed = playerRef.current.playbackRate();
          if (typeof speed === "number") {
            setLocalPlaybackSpeed(speed);
            projectStore.setPlaybackSpeed(speed);
          }
        }
      };
      playerRef.current.on("ratechange", updateSpeed);
    }

    // Dispose of the player when component unmounts
    return () => {
      if (playerRef.current && !videoNode.current?.isConnected) {
        playerRef.current.dispose();
        playerRef.current = null;
        isInitialized.current = false;
      }
    };
  }, [projectStore]);

  // Update source when it changes
  useEffect(() => {
    if (playerRef.current && source) {
      playerRef.current.src({ src: source, type: "video/mp4" });
    }
  }, [source]);

  /**
   * Handle keyboard shortcuts for clipping operations and video playback controls.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player) return;

      // Clipping shortcuts
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        projectStore.markIn(player.currentTime());
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        projectStore.markOut(player.currentTime());
      } else if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        projectStore.addClipFromMarks();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        projectStore.clearMarks();
      }
      // Playback control shortcuts
      else if (e.key === " ") {
        e.preventDefault();
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      } else if (e.key === "ArrowLeft" && e.shiftKey) {
        e.preventDefault();
        const currentRate = player.playbackRate();
        if (typeof currentRate === "number") {
          player.playbackRate(Math.max(0.25, currentRate - 0.25));
        }
      } else if (e.key === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        const currentRate = player.playbackRate();
        if (typeof currentRate === "number") {
          player.playbackRate(Math.min(2, currentRate + 0.25));
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const skipAmount = e.ctrlKey ? 15 : 5;
        const currentTime = player.currentTime();
        if (typeof currentTime === "number") {
          player.currentTime(Math.max(0, currentTime - skipAmount));
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const skipAmount = e.ctrlKey ? 15 : 5;
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (typeof currentTime === "number" && typeof duration === "number") {
          player.currentTime(Math.min(duration, currentTime + skipAmount));
        }
      } else if (e.key === ",") {
        e.preventDefault();
        // Move one frame backward (assuming 30fps)
        const currentTime = player.currentTime();
        if (typeof currentTime === "number") {
          player.currentTime(Math.max(0, currentTime - 1 / 30));
        }
      } else if (e.key === ".") {
        e.preventDefault();
        // Move one frame forward (assuming 30fps)
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (typeof currentTime === "number" && typeof duration === "number") {
          player.currentTime(Math.min(duration, currentTime + 1 / 30));
        }
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (player.isFullscreen()) {
          player.exitFullscreen();
        } else {
          player.requestFullscreen();
        }
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        player.muted(!player.muted());
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
    <div style={{ position: "relative", width: "100%", maxWidth: "960px" }}>
      {/* Overlay labels for current time and playback speed */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "14px",
          fontFamily: "monospace",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "flex-end",
        }}
      >
        <div>
          <span style={{ fontWeight: 600 }}>Time:</span> {formatTimestamp(projectStore.currentTime)}
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Speed:</span> {localPlaybackSpeed.toFixed(2)}x
        </div>
      </div>

      <div data-vjs-player style={{ width: "100%" }}>
        <video ref={videoNode} className="video-js vjs-big-play-centered" playsInline />
      </div>
    </div>
  );
};

export default VideoPlayer;
