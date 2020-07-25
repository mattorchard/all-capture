import React, { useReducer } from "react";
import { AnnotatedTrack, AudioLayer, VideoLayer } from "../types/MediaTypes";
import { swapValues } from "../helpers/arrayHelpers";
import {
  annotatedTrackToAudioLayer,
  annotatedTrackToVideoLayer,
  createVideoMapping,
  VideoMapping,
} from "../helpers/mediaHelpers";

export interface TrackEditorState {
  output: {
    fileName: string;
    width: number;
    height: number;
  };
  isRecording: boolean;
  audioLayers: AudioLayer[];
  videoLayers: VideoLayer[];
  videoMap: VideoMapping;
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
    }
  | {
      type: "layerMoved";
      index: number;
      direction: "up" | "down";
    };

const initialState: TrackEditorState = {
  isRecording: false,
  output: {
    fileName: "MyRecording",
    width: 1280,
    height: 720,
  },
  audioLayers: [],
  videoLayers: [],
  videoMap: {},
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
          videoLayers.unshift(annotatedTrackToVideoLayer(newTrack));
        } else if (newTrack.track.kind === "audio") {
          audioLayers.unshift(annotatedTrackToAudioLayer(newTrack));
        } else {
          throw new Error(
            `Unexpected track kind "${newTrack.track.kind}", expected audio or video`
          );
        }
      });
      return {
        ...state,
        audioLayers,
        videoLayers,
        videoMap: createVideoMapping(videoLayers, state.videoMap),
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
    case "layerMoved": {
      const { index, direction } = action;
      if (index === 0 && direction === "up") {
        return state; // Already on top
      }
      if (index === state.videoLayers.length - 1 && direction === "down") {
        return state; // Already on bottom
      }
      const indexOffset = direction === "up" ? -1 : 1;
      const videoLayers = swapValues(
        state.videoLayers,
        index,
        index + indexOffset
      );
      return {
        ...state,
        videoLayers,
        videoMap: createVideoMapping(videoLayers, state.videoMap),
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
  // Todo: Handle video resize events (on window / tab screen shares)

  return [state, dispatch];
};

export default useTrackEditor;
