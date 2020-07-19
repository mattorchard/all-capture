import React, { useState } from "react";
import { Button, Flex, Stack, useDisclosure } from "@chakra-ui/core";
import RecordingTitle from "../RecordingTitle";
import PreviewSection from "../PreviewSection";
import TrackDetailsSection from "../TrackDetailsSection";
import AddTracksModal from "../AddTracksModal";

const SetupPage: React.FC<{}> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoTracks, setVideoTracks] = useState<MediaStreamTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<MediaStreamTrack[]>([]);

  const handleNewTracks = (tracks: MediaStreamTrack[]) => {
    setVideoTracks((currentTracks) => [
      ...currentTracks,
      ...tracks.filter((track) => track.kind === "video"),
    ]);
    setAudioTracks((currentTracks) => [
      ...currentTracks,
      ...tracks.filter((track) => track.kind === "audio"),
    ]);
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Flex as="header" bg="purple.700" py={2} px={4}>
        <RecordingTitle />
      </Flex>
      <PreviewSection
        audioTracks={[]}
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
        <Button variantColor="green" leftIcon="add" onClick={onOpen}>
          Add Tracks
        </Button>
        <Button variant="outline" variantColor="red" leftIcon="warning-2">
          Start Recording
        </Button>
      </Stack>
      <TrackDetailsSection
        videoTracks={videoTracks}
        audioTracks={audioTracks}
      />
      {isOpen && (
        <AddTracksModal
          isOpen={isOpen}
          onClose={onClose}
          onAddedTracks={handleNewTracks}
        />
      )}
    </Flex>
  );
};

export default SetupPage;
