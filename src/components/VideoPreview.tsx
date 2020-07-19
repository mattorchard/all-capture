import React, { useEffect, useRef } from "react";

const VideoPreview: React.FC<{ videoTrack: MediaStreamTrack }> = ({
  videoTrack,
}) => {
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
  return (
    <video
      className="video-preview"
      ref={videoRef}
      autoPlay
      muted
      style={{ width: "100%", height: "auto", maxWidth: 200 }}
    />
  );
};

export default VideoPreview;
