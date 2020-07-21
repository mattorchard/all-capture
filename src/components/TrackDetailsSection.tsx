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
import { AnnotatedTrack } from "../types/MediaTypes";
import VideoDetails from "./VideoDetails";
import AudioDetails from "./AudioDetails";

const TrackDetailsSection: React.FC<{
  videoTracks: AnnotatedTrack[];
  audioTracks: AnnotatedTrack[];
  playPreviews: boolean;
}> = ({ videoTracks, audioTracks, playPreviews }) => {
  return (
    <Box as="section" bg="gray.900" p={2} flex={1}>
      <Heading as="h2" size="lg">
        Tracks
      </Heading>

      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <AccordionItem>
          <AccordionHeader>
            <Heading as="h3" size="md">
              Video Tracks ({videoTracks.length})
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {videoTracks.length === 0 ? (
              <Text>No video tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {playPreviews &&
                  videoTracks.map((annotatedTrack) => (
                    <VideoDetails
                      key={annotatedTrack.track.id}
                      as="li"
                      annotatedTrack={annotatedTrack}
                    />
                  ))}
              </Stack>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <Heading as="h3" size="md">
              Audio Tracks ({audioTracks.length})
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {audioTracks.length === 0 ? (
              <Text>No audio tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {playPreviews &&
                  audioTracks.map((annotatedTrack) => (
                    <AudioDetails
                      key={annotatedTrack.track.id}
                      as="li"
                      annotatedTrack={annotatedTrack}
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
