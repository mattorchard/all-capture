import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/core";
import VideoPreview from "./VideoPreview";
import AudioPreview from "./AudioPreview";
import { AnnotatedTrack } from "../types/MediaTypes";

const TrackDetailsSection: React.FC<{
  videoTracks: AnnotatedTrack[];
  audioTracks: AnnotatedTrack[];
}> = ({ videoTracks, audioTracks }) => {
  return (
    <Box as="section" bg="gray.900" p={2} flex={1}>
      <Heading as="h2" size="lg">
        Tracks
      </Heading>

      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <AccordionItem>
          <AccordionHeader>
            <Heading as="h3" size="md">
              Video Tracks
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {videoTracks.length === 0 ? (
              <Text>No video tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {videoTracks.map((annotatedTrack) => (
                  <VideoPreview
                    key={annotatedTrack.track.id}
                    videoTrack={annotatedTrack.track}
                  />
                ))}
              </Stack>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Heading as="h3" size="md">
              Audio Tracks
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {audioTracks.length === 0 ? (
              <Text>No audio tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {audioTracks.map((annotatedTrack) => (
                  <AudioPreview
                    key={annotatedTrack.track.id}
                    audioTrack={annotatedTrack.track}
                    backgroundColor="#171923"
                    barColor="#553c9a"
                  />
                ))}
              </Stack>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TrackDetailsSection;
