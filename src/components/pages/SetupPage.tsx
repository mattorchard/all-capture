import React from "react";
import { Button, Flex, Stack, useToast } from "@chakra-ui/core";
import RecordingTitle from "../RecordingTitle";
import OutputSection from "../OutputSection";
import TrackDetailsSection from "../TrackDetailsSection";
import AddInputDeviceButton from "../AddInputDeviceButton";
import { AnnotatedTrack } from "../../types/MediaTypes";
import useTrackEditor from "../../hooks/useTrackEditor";

const SetupPage: React.FC<{}> = () => {
  const toast = useToast();
  const [state, dispatch] = useTrackEditor();

  const addDesktopCapture = async () => {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const annotatedTracks: AnnotatedTrack[] = stream
        .getTracks()
        .map((track) => ({
          track,
          settings: track.getSettings(),
          source: "computer",
        }));
      dispatch({ type: "tracksAdded", annotatedTracks });
    } catch (error) {
      console.error("Unable to get display media", error);
      toast({
        status: "error",
        title: "Error",
        description: "Error, unable trying to record computer",
      });
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Flex as="header" bg="purple.700" py={2} px={4}>
        <RecordingTitle />
      </Flex>
      <OutputSection editorState={state} />
      <Stack
        as="section"
        direction="row"
        justify="center"
        bg="purple.900"
        p={2}
      >
        <AddInputDeviceButton
          onTracksAdded={(annotatedTracks) =>
            dispatch({ type: "tracksAdded", annotatedTracks })
          }
          isDisabled={state.isRecording}
        >
          Add Input Device
        </AddInputDeviceButton>
        <Button
          leftIcon="add"
          onClick={addDesktopCapture}
          isDisabled={state.isRecording}
        >
          Add Desktop Capture
        </Button>
        <Button
          variant={state.isRecording ? "solid" : "outline"}
          variantColor="red"
          leftIcon="warning-2"
          onClick={() =>
            dispatch({
              type: state.isRecording ? "recordingStopped" : "recordingStarted",
            })
          }
        >
          {state.isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </Stack>
      <TrackDetailsSection
        videoTracks={state.videoTracks}
        audioTracks={state.audioTracks}
        playPreviews={!state.isRecording}
      />
    </Flex>
  );
};

export default SetupPage;
