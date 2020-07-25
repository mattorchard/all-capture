import { AnnotatedTrack, AudioLayer, VideoLayer } from "../types/MediaTypes";
import { trackToVideo } from "./videoHelpers";

export const combineAudio = (layers: AudioLayer[]) => {
  const context = new AudioContext();
  const destination = context.createMediaStreamDestination();

  layers.forEach((layer) => {
    if (layer.muted) {
      return; // Don't bother adding this layer
    }
    // Convert track to audio source
    const inputStream = new MediaStream();
    inputStream.addTrack(layer.track);
    const source = context.createMediaStreamSource(inputStream);

    // Create gain node for volume adjustment
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(layer.gain, 0);

    // Connect up to audio graph
    source.connect(gainNode);
    gainNode.connect(destination);
  });

  return destination.stream;
};

export const annotatedTrackToVideoLayer = (
  annotatedTrack: AnnotatedTrack
): VideoLayer => {
  const width = annotatedTrack.settings.width;
  const height = annotatedTrack.settings.height;

  if (!width || !height) {
    console.error(
      "Missing data size info in video settings",
      annotatedTrack.settings
    );
    throw new Error("Missing width or height info on new video");
  }

  return {
    ...annotatedTrack,
    size: { width, height },
    naturalSize: { width, height },
    anchor: "middle-middle",
    hidden: false,
  };
};

export const annotatedTrackToAudioLayer = (
  annotatedTrack: AnnotatedTrack
): AudioLayer => {
  return {
    ...annotatedTrack,
    gain: 1,
    muted: false,
  };
};

export interface VideoMapping {
  [trackId: string]: HTMLVideoElement;
}

const disposeVideo = (video: HTMLVideoElement) => {
  video.pause();
  video.srcObject = null;
  video.load();
  video.remove();
};

export const createVideoMapping = (
  annotatedTracks: AnnotatedTrack[],
  existingTrackMapping: VideoMapping
): VideoMapping => {
  const trackIdsInUse = new Set(
    annotatedTracks.map((annotatedTrack) => annotatedTrack.track.id)
  );
  Object.entries(existingTrackMapping).forEach(([trackId, video]) => {
    if (!trackIdsInUse.has(trackId)) {
      disposeVideo(video);
    }
  });

  const newTrackMapping: VideoMapping = {};
  annotatedTracks.forEach((annotatedTrack) => {
    const trackId = annotatedTrack.track.id;
    if (trackId in existingTrackMapping) {
      newTrackMapping[trackId] = existingTrackMapping[trackId];
    } else {
      newTrackMapping[trackId] = trackToVideo(annotatedTrack.track);
    }
  });

  return newTrackMapping;
};

export const layerIsLive = ({ track }: { track: MediaStreamTrack }) =>
  track.readyState === "live";
