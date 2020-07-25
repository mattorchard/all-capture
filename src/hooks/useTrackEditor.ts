import React, { useEffect, useReducer } from "react";
import { AnnotatedTrack, AudioLayer, VideoLayer } from "../types/MediaTypes";
import { filterOutIndex, swapValues } from "../helpers/arrayHelpers";
import {
  annotatedTrackToAudioLayer,
  annotatedTrackToVideoLayer,
  createVideoMapping,
  layerIsLive,
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
      // Actions with no additional params
      type: "recordingStarted" | "recordingStopped" | "trackEnded";
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
    }
  | {
      type: "removeTrack";
      index: number;
      kind: "audio" | "video";
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
    case "removeTrack": {
      const { index, kind } = action;

      if (kind === "video") {
        state.videoLayers[index].track.stop();
        const videoLayers = state.videoLayers.filter(filterOutIndex(index));
        return {
          ...state,
          videoLayers,
          videoMap: createVideoMapping(videoLayers, state.videoMap),
        };
      } else {
        state.audioLayers[index].track.stop();
        const audioLayers = state.audioLayers.filter(filterOutIndex(index));
        return {
          ...state,
          audioLayers,
        };
      }
    }
    case "trackEnded": {
      const videoLayers = state.videoLayers.filter(layerIsLive);
      const audioLayers = state.audioLayers.filter(layerIsLive);
      return {
        ...state,
        audioLayers,
        videoLayers,
        videoMap: createVideoMapping(videoLayers, state.videoMap),
      };
    }
  }
};

const useTrackEditor = (): [
  TrackEditorState,
  React.Dispatch<TrackEditorAction>
] => {
  const [state, dispatch] = useReducer(trackEditorReducer, initialState);

  const { videoLayers, audioLayers } = state;
  useEffect(() => {
    const allTracks = [
      ...audioLayers.map((layer) => layer.track),
      ...videoLayers.map((layer) => layer.track),
    ];

    const handleTrackEnd = (event: Event) => {
      if (event.currentTarget instanceof MediaStreamTrack) {
        event.currentTarget.stop();
      }
      dispatch({ type: "trackEnded" });
    };

    allTracks.forEach((track) => {
      track.addEventListener("ended", handleTrackEnd);
    });

    return () =>
      allTracks.forEach((track) =>
        track.removeEventListener("ended", handleTrackEnd)
      );
  }, [videoLayers, audioLayers, dispatch]);

  // Todo: Handle video resize events (on window / tab screen shares)

  return [state, dispatch];
};

export default useTrackEditor;
