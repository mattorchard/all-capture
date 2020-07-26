import React, { useEffect, useRef } from "react";
import { Alert, AlertIcon } from "@chakra-ui/core";

const VideoPreview: React.FC<{
  videoTrack: MediaStreamTrack;
  isDisabled?: boolean;
}> = ({ videoTrack, isDisabled = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      console.warn("Unable to load preview when track was present");
      return;
    }
    const stream = new MediaStream();
    stream.addTrack(videoTrack);
    videoRef.current.srcObject = stream;
  }, [videoTrack]);

  useEffect(() => {
    if (isDisabled) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [isDisabled]);

  return (
    <div className="grid-stack">
      <video
        className="video-preview"
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", height: "auto", maxWidth: 200 }}
      />
      {isDisabled && (
        <Alert status="info" borderRadius={4} variant="solid">
          <AlertIcon />
          Preview Paused
        </Alert>
      )}
    </div>
  );
};

export default VideoPreview;
