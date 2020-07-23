export interface FakeMediaRecorder {
  ondataavailable: (event: { data: BlobPart }) => void;
  stop: () => void;
  start: () => void;
}

export interface AnnotatedTrack {
  track: MediaStreamTrack;
  settings: MediaTrackSettings;
  source: "computer" | "input-device";
  deviceInfo?: MediaDeviceInfo;
}

export type AnchorValue =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "middle-left"
  | "middle-middle"
  | "middle-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right";

export interface Size {
  width: number;
  height: number;
}

export interface VideoLayer extends AnnotatedTrack {
  anchor: AnchorValue;
  size: Size;
  naturalSize: Size;
  hidden: boolean;
}

export interface AudioLayer extends AnnotatedTrack {
  gain: number;
  muted: boolean;
}
