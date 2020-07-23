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
  onLayerChange: (
    kind: "audio" | "video",
    index: number,
    layer: AudioLayer | VideoLayer
  ) => void;
  onLayerMoved: (index: number, direction: "up" | "down") => void;
  disablePreviews?: boolean;
}> = ({
  videoLayers,
  audioLayers,
  onLayerChange,
  onLayerMoved,
  disablePreviews = false,
}) => {
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
                {videoLayers.map((videoLayer, index) => (
                  <VideoDetails
                    key={videoLayer.track.id}
                    as="li"
                    videoLayer={videoLayer}
                    disablePreview={disablePreviews}
                    onSizeChange={(size) =>
                      onLayerChange("video", index, { ...videoLayer, size })
                    }
                    onAnchorChange={(anchor) =>
                      onLayerChange("video", index, { ...videoLayer, anchor })
                    }
                    onLayerMoved={(direction) => onLayerMoved(index, direction)}
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
                {disablePreviews ||
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
