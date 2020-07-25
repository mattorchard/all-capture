import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
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
    <Flex justify="center" bg="gray.900" p={2} flex={1}>
      <Box as="section" width="100%" maxWidth="1200px">
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
                      onLayerMoved={(direction) =>
                        onLayerMoved(index, direction)
                      }
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
                  {audioLayers.map((audioLayer, index) => (
                    <AudioDetails
                      key={audioLayer.track.id}
                      as="li"
                      audioLayer={audioLayer}
                      disablePreview={disablePreviews}
                      onGainChange={(gain) =>
                        onLayerChange("audio", index, { ...audioLayer, gain })
                      }
                      onMuteToggle={() =>
                        onLayerChange("audio", index, {
                          ...audioLayer,
                          muted: !audioLayer.muted,
                        })
                      }
                    />
                  ))}
                </Stack>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Flex>
  );
};

export default TrackDetailsSection;
