export const trackToVideo = (videoTrack: MediaStreamTrack) => {
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
