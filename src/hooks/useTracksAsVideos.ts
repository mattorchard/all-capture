import { useMemo } from "react";

const trackToVideo = (videoTrack: MediaStreamTrack) => {
  if (videoTrack.kind !== "video") {
  }
  const video = document.createElement("video");
  video.setAttribute("muted", "true");
  video.setAttribute("autoplay", "true");
  const stream = new MediaStream();
  stream.addTrack(videoTrack);
  video.srcObject = stream;
  return video;
};

const useTracksAsVideos = (videoTracks: MediaStreamTrack[]) =>
  useMemo(() => videoTracks.map(trackToVideo), [videoTracks]);

export default useTracksAsVideos;
