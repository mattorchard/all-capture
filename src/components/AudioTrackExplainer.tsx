import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Link,
  Text,
} from "@chakra-ui/core";
import React from "react";

const AudioTrackExplainer = () => (
  <Alert variant="left-accent">
    <AlertIcon />
    <div>
      <AlertTitle>No audio tracks...Yet</AlertTitle>
      <AlertDescription>
        To add an audio track select a microphone from the{" "}
        <Link href="#add-input-device" color="purple.300">
          Add Input Device
        </Link>{" "}
        button above, or add a screen capture from the{" "}
        <Link href="#add-computer-capture" color="purple.300">
          Add Computer Capture
        </Link>{" "}
        button above (and check the{" "}
        <Text as="em" color="purple.400">
          Share audio
        </Text>{" "}
        checkbox)
      </AlertDescription>
    </div>
  </Alert>
);

export default AudioTrackExplainer;
