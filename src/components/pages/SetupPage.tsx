import React, { useState } from "react";
import { Button, Flex, Stack, useToast } from "@chakra-ui/core";
import RecordingTitle from "../RecordingTitle";
import PreviewSection from "../PreviewSection";
import TrackDetailsSection from "../TrackDetailsSection";
import AddInputDeviceButton from "../AddInputDeviceButton";
import { downloadBlob } from "../../helpers/fileHelpers";

interface FakeMediaRecorder {
  ondataavailable: (event: { data: BlobPart }) => void;
  stop: () => void;
  start: () => void;
}

const SetupPage: React.FC<{}> = () => {
  const toast = useToast();
  const [videoTracks, setVideoTracks] = useState<MediaStreamTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<MediaStreamTrack[]>([]);

  const handleNewStream = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    setVideoTracks((currentTracks) => [
      ...currentTracks,
      ...tracks.filter((track) => track.kind === "video"),
    ]);
    setAudioTracks((currentTracks) => [
      ...currentTracks,
      ...tracks.filter((track) => track.kind === "audio"),
    ]);
  };

  const addDesktopCapture = async () => {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      handleNewStream(stream);
    } catch (error) {
      console.error("Unable to get display media", error);
      toast({
        status: "error",
        title: "Error",
        description: "Error, unable trying to record computer",
      });
    }
  };

  const startRecordingTest = () => {
    const recordingStream = new MediaStream();

    const [firstVideoTrack] = videoTracks;
    const [firstAudioTrack] = audioTracks;

    recordingStream.addTrack(firstVideoTrack);
    recordingStream.addTrack(firstAudioTrack);
    //@ts-ignore
    const mediaRecorder: FakeMediaRecorder = new MediaRecorder(
      recordingStream,
      { mimeType: "video/webm; codecs=vp9" }
    );
    mediaRecorder.ondataavailable = (event) => {
      const chunk = event.data;
      const blob = new Blob([chunk], { type: "video/webm" });
      downloadBlob(blob, "MyExample.webm");
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000);
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Flex as="header" bg="purple.700" py={2} px={4}>
        <RecordingTitle />
      </Flex>
      <PreviewSection
        audioTracks={audioTracks}
        videoTracks={videoTracks}
        width={1920}
        height={1080}
      />
      <Stack
        as="section"
        direction="row"
        justify="center"
        bg="purple.900"
        p={2}
      >
        <AddInputDeviceButton onStreamAdded={handleNewStream}>
          Add Input Device
        </AddInputDeviceButton>
        <Button leftIcon="add" onClick={addDesktopCapture}>
          Add Desktop Capture
        </Button>
        <Button
          variant="outline"
          variantColor="red"
          leftIcon="warning-2"
          onClick={startRecordingTest}
        >
          Start Recording
        </Button>
      </Stack>
      <TrackDetailsSection
        videoTracks={videoTracks}
        audioTracks={audioTracks}
      />
    </Flex>
  );
};

export default SetupPage;
