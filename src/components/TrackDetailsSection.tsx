import React from "react";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/core";
import { AudioLayer, Size, VideoLayer } from "../types/MediaTypes";
import VideoDetails from "./VideoDetails";
import AudioDetails from "./AudioDetails";

const TrackDetailsSection: React.FC<{
  videoLayers: VideoLayer[];
  audioLayers: AudioLayer[];
  outputSize: Size;
  onLayerChange: (
    kind: "audio" | "video",
    index: number,
    layer: AudioLayer | VideoLayer
  ) => void;
  onLayerMoved: (index: number, direction: "up" | "down") => void;
  onRemoveTrack: (kind: "audio" | "video", index: number) => void;
  disablePreviews?: boolean;
}> = ({
  videoLayers,
  audioLayers,
  onLayerChange,
  onLayerMoved,
  outputSize,
  onRemoveTrack,
  disablePreviews = false,
}) => {
  return (
    <Flex justify="center" bg="gray.900" p={2} flex={1}>
      <Box as="section" width="100%" maxWidth="900px">
        <Heading as="h2" size="lg">
          Tracks
        </Heading>
        <Divider />

        <Heading as="h3" size="md" mt={2} mb={4}>
          Video Tracks ({videoLayers.length})
        </Heading>

        {videoLayers.length === 0 ? (
          <Text>No video tracks...yet!</Text>
        ) : (
          <Stack as="ul">
            {videoLayers.map((videoLayer, index) => (
              <VideoDetails
                key={videoLayer.track.id}
                as="li"
                videoLayer={videoLayer}
                outputSize={outputSize}
                disablePreview={disablePreviews}
                onSizeChange={(size) =>
                  onLayerChange("video", index, { ...videoLayer, size })
                }
                onAnchorChange={(anchor) =>
                  onLayerChange("video", index, { ...videoLayer, anchor })
                }
                onLayerMoved={(direction) => onLayerMoved(index, direction)}
                onRemoveTrack={() => onRemoveTrack("video", index)}
              />
            ))}
          </Stack>
        )}

        <Divider />

        <Heading as="h3" size="md" mt={2} mb={4}>
          Audio Tracks ({audioLayers.length})
        </Heading>
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
                onRemoveTrack={() => onRemoveTrack("audio", index)}
              />
            ))}
          </Stack>
        )}

        <Divider />
      </Box>
    </Flex>
  );
};

export default TrackDetailsSection;
