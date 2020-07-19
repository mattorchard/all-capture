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

const TrackDetailsSection: React.FC<{ videoTracks: MediaStreamTrack[] }> = ({
  videoTracks,
}) => (
  <Box as="section" bg="gray.900" p={2}>
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
              {videoTracks.map((track) => (
                <VideoPreview key={track.id} videoTrack={track} />
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
        <AccordionPanel>AUDIOOOO</AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>
);

export default TrackDetailsSection;
