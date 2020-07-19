import React, { useReducer } from "react";
import { AnnotatedTrack } from "../types/MediaTypes";

export interface TrackEditorState {
  output: {
    fileName: string;
    width: number;
    height: number;
  };
  isRecording: boolean;
  audioTracks: AnnotatedTrack[];
  videoTracks: AnnotatedTrack[];
}

type TrackEditorAction =
  | {
      type: "trackEnded" | "recordingStarted" | "recordingStopped";
    }
  | {
      type: "tracksAdded";
      annotatedTracks: AnnotatedTrack[];
    };

const initialState: TrackEditorState = {
  isRecording: false,
  output: {
    fileName: "MyRecording",
    width: 1920,
    height: 1080,
  },
  audioTracks: [],
  videoTracks: [],
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
      const videoTracks = [...state.videoTracks];
      const audioTracks = [...state.audioTracks];

      action.annotatedTracks.forEach((newTrack) => {
        if (newTrack.track.kind === "video") {
          videoTracks.push(newTrack);
        } else if (newTrack.track.kind === "audio") {
          audioTracks.push(newTrack);
        } else {
          throw new Error(
            `Unexpected track kind "${newTrack.track.kind}", expected audio or video`
          );
        }
      });
      return {
        ...state,
        videoTracks,
        audioTracks,
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
