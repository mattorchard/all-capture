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
