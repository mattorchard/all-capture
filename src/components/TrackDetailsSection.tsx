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
import { AudioLayer, VideoLayer } from "../types/MediaTypes";
import VideoDetails from "./VideoDetails";
import AudioDetails from "./AudioDetails";

const TrackDetailsSection: React.FC<{
  videoLayers: VideoLayer[];
  audioLayers: AudioLayer[];
  playPreviews: boolean;
}> = ({ videoLayers, audioLayers, playPreviews }) => {
  return (
    <Box as="section" bg="gray.900" p={2} flex={1}>
      <Heading as="h2" size="lg">
        Tracks
      </Heading>

      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <AccordionItem>
          <AccordionHeader>
            <Heading as="h3" size="md">
              Video Tracks ({videoLayers.length})
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {videoLayers.length === 0 ? (
              <Text>No video tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {playPreviews &&
                  videoLayers.map((annotatedTrack) => (
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
              Audio Tracks ({audioLayers.length})
            </Heading>
            <AccordionIcon ml={2} />
          </AccordionHeader>
          <AccordionPanel>
            {audioLayers.length === 0 ? (
              <Text>No audio tracks...yet!</Text>
            ) : (
              <Stack as="ul">
                {playPreviews &&
                  audioLayers.map((audioLayers) => (
                    <AudioDetails
                      key={audioLayers.track.id}
                      as="li"
                      annotatedTrack={audioLayers}
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
