import { AnnotatedTrack } from "../types/MediaTypes";

export const combineAudio = (audioTracks: AnnotatedTrack[]) => {
  const context = new AudioContext();
  const sources = audioTracks.map((annotatedTrack) => {
    const inputStream = new MediaStream();
    inputStream.addTrack(annotatedTrack.track);
    return context.createMediaStreamSource(inputStream);
  });
  const destination = context.createMediaStreamDestination();
  // Todo: Add gain node for volume control
  sources.forEach((source) => source.connect(destination));
  return destination.stream;
};
