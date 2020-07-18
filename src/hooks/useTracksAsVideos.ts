import { useMemo } from "react";

const trackToVideo = (videoTrack: MediaStreamTrack) => {
  if (videoTrack.kind !== "video") {
  }
  const video = document.createElement("video");
  const stream = new MediaStream();
  stream.addTrack(videoTrack);
  return video;
};

const useTracksAsVideos = (videoTracks: MediaStreamTrack[]) =>
  useMemo(() => videoTracks.map(trackToVideo), [videoTracks]);

export default useTracksAsVideos;
