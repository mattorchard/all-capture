import React, { useReducer } from "react";
import { AnnotatedTrack } from "../types/MediaTypes";

interface TrackEditorState {
  output: {
    fileName: string;
    width: number;
    height: number;
  };
  audioTracks: AnnotatedTrack[];
  videoTracks: AnnotatedTrack[];
}

type TrackEditorAction =
  | {
      type: "tracksAdded";
      annotatedTracks: AnnotatedTrack[];
    }
  | {
      type: "trackEnded";
    }
  | {
      type: "trackRemoved";
    };

const initialState: TrackEditorState = {
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
