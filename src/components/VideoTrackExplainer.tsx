import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Link,
} from "@chakra-ui/core";
import React from "react";

const VideoTrackExplainer = () => (
  <Alert variant="left-accent">
    <AlertIcon />
    <div>
      <AlertTitle>No video tracks...Yet</AlertTitle>
      <AlertDescription>
        To add a video track select a camera from the{" "}
        <Link href="#add-input-device" color="purple.300">
          Add Input Device
        </Link>{" "}
        button above, or add a screen capture from the{" "}
        <Link href="#add-computer-capture" color="purple.300">
          Add Computer Capture
        </Link>{" "}
        button above.
      </AlertDescription>
    </div>
  </Alert>
);

export default VideoTrackExplainer;
