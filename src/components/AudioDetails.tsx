import React from "react";
import { AnnotatedTrack } from "../types/MediaTypes";
import { Flex } from "@chakra-ui/core";
import AudioPreview from "./AudioPreview";

const AudioDetails: React.FC<{
  annotatedTrack: AnnotatedTrack;
  as: React.ElementType;
}> = ({ annotatedTrack, as }) => (
  <Flex as={as}>
    <AudioPreview
      key={annotatedTrack.track.id}
      audioTrack={annotatedTrack.track}
      backgroundColor="#171923"
      barColor="#553c9a"
    />
  </Flex>
);

export default AudioDetails;
