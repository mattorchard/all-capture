import React from "react";
import { Button, Flex, Stack, useToast } from "@chakra-ui/core";
import RecordingTitle from "../RecordingTitle";
import OutputSection from "../OutputSection";
import TrackDetailsSection from "../TrackDetailsSection";
import AddInputDeviceButton from "../AddInputDeviceButton";
import { AnnotatedTrack, AudioLayer, VideoLayer } from "../../types/MediaTypes";
import useTrackEditor from "../../hooks/useTrackEditor";
import OutputSizeSelector from "../OutputSizeSelector";

const SetupPage: React.FC<{}> = () => {
  const toast = useToast();
  const [state, dispatch] = useTrackEditor();

  const addComputerCapture = async () => {
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
        status: "warning",
        title: "Uh Oh",
        description: "Didn't get permission to start computer capture",
      });
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Flex
        as="header"
        bg="purple.800"
        px={4}
        justify="space-between"
        align="center"
      >
        <RecordingTitle
          title={state.output.fileName}
          onTitleChanged={(fileName) =>
            dispatch({
              type: "outputSettingsChanged",
              output: { ...state.output, fileName },
            })
          }
        />
        <OutputSizeSelector
          onSizeChange={(size) =>
            dispatch({
              type: "outputSettingsChanged",
              output: { ...state.output, size },
            })
          }
        />
      </Flex>

      <OutputSection editorState={state} />
      <Stack
        as="section"
        isInline
        justify="center"
        bg="purple.900"
        p={2}
        shouldWrapChildren
      >
        <AddInputDeviceButton
          onTracksAdded={(annotatedTracks) =>
            dispatch({ type: "tracksAdded", annotatedTracks })
          }
          isDisabled={state.isRecording}
        />
        <Button
          leftIcon="add"
          onClick={addComputerCapture}
          isDisabled={state.isRecording}
          id="add-computer-capture"
        >
          Add Computer Capture
        </Button>
        <Button
          variant={state.isRecording ? "solid" : "outline"}
          variantColor="red"
          leftIcon="warning-2"
          onClick={() => {
            if (!state.isRecording && state.videoLayers.length < 1) {
              toast({
                status: "warning",
                title: "Cannot Record",
                description:
                  "You must have at least one video track to begin recording",
              });
            } else {
              dispatch({
                type: state.isRecording
                  ? "recordingStopped"
                  : "recordingStarted",
              });
            }
          }}
        >
          {state.isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </Stack>
      <TrackDetailsSection
        videoLayers={state.videoLayers}
        audioLayers={state.audioLayers}
        outputSize={state.output.size}
        disablePreviews={state.isRecording}
        onLayerMoved={(index, direction) =>
          dispatch({ type: "layerMoved", index, direction })
        }
        onLayerChange={(kind, index, layer) =>
          kind === "video"
            ? dispatch({
                type: "layerChange",
                kind,
                index,
                layer: layer as VideoLayer,
              })
            : dispatch({
                type: "layerChange",
                kind,
                index,
                layer: layer as AudioLayer,
              })
        }
        onRemoveTrack={(kind, index) =>
          dispatch({ type: "removeTrack", kind, index })
        }
      />
    </Flex>
  );
};

export default SetupPage;
