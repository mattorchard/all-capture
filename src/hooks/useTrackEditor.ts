import React, { useReducer } from "react";
import { AnnotatedTrack, AudioLayer, VideoLayer } from "../types/MediaTypes";

const annotatedTrackToVideoLayer = (
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

const annotatedTrackToAudioLayer = (
  annotatedTrack: AnnotatedTrack
): AudioLayer => {
  return {
    ...annotatedTrack,
    gain: 1,
    muted: false,
  };
};

export interface TrackEditorState {
  output: {
    fileName: string;
    width: number;
    height: number;
  };
  isRecording: boolean;
  audioLayers: AudioLayer[];
  videoLayers: VideoLayer[];
}

type TrackEditorAction =
  | {
      type: "trackEnded" | "recordingStarted" | "recordingStopped";
    }
  | {
      type: "tracksAdded";
      annotatedTracks: AnnotatedTrack[];
    }
  | {
      type: "layerChange";
      kind: "video";
      index: number;
      layer: VideoLayer;
    }
  | {
      type: "layerChange";
      kind: "audio";
      index: number;
      layer: AudioLayer;
    };

const initialState: TrackEditorState = {
  isRecording: false,
  output: {
    fileName: "MyRecording",
    width: 1920,
    height: 1080,
  },
  audioLayers: [],
  videoLayers: [],
};

const trackEditorReducer = (
  state: TrackEditorState,
  action: TrackEditorAction
) => {
  switch (action.type) {
    case "recordingStarted": {
      return { ...state, isRecording: true };
    }
    case "recordingStopped": {
      return { ...state, isRecording: false };
    }
    case "tracksAdded": {
      const videoLayers = [...state.videoLayers];
      const audioLayers = [...state.audioLayers];

      action.annotatedTracks.forEach((newTrack) => {
        if (newTrack.track.kind === "video") {
          videoLayers.push(annotatedTrackToVideoLayer(newTrack));
        } else if (newTrack.track.kind === "audio") {
          audioLayers.push(annotatedTrackToAudioLayer(newTrack));
        } else {
          throw new Error(
            `Unexpected track kind "${newTrack.track.kind}", expected audio or video`
          );
        }
      });
      return {
        ...state,
        videoLayers,
        audioLayers,
      };
    }
    case "layerChange": {
      const layerKey = action.kind === "video" ? "videoLayers" : "audioLayers";
      const layers = state[layerKey];
      layers[action.index] = action.layer;

      return {
        ...state,
        [layerKey]: layers,
      };
    }
    default:
      throw new Error(
        `Got unrecognized action type in trackEditorReducer "${action.type}"`
      );
  }
};

const useTrackEditor = (): [
  TrackEditorState,
  React.Dispatch<TrackEditorAction>
] => {
  const [state, dispatch] = useReducer(trackEditorReducer, initialState);
  // Todo: Use effect to auto-remove ended tracks
  return [state, dispatch];
};

export default useTrackEditor;
