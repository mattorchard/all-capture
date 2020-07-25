import React from "react";
import VideoPreview from "./VideoPreview";
import AnchorChooser from "./AnchorChooser";
import { Badge, Box, Flex, IconButton, Stack } from "@chakra-ui/core";
import {
  AnchorValue,
  FakeSharedScreenTrackSettings,
  Size,
  VideoLayer,
} from "../types/MediaTypes";
import VideoSizeSelector from "./VideoSizeSelector";
import { DetailsSubSection } from "./DetailsSubSection";

const VideoDetails: React.FC<{
  videoLayer: VideoLayer;
  as: React.ElementType;
  outputSize: Size;
  onAnchorChange: (anchor: AnchorValue) => void;
  onSizeChange: (size: Size) => void;
  onLayerMoved: (direction: "up" | "down") => void;
  disablePreview?: boolean;
}> = ({
  videoLayer,
  as,
  onSizeChange,
  onAnchorChange,
  onLayerMoved,
  outputSize,
  disablePreview = false,
}) => (
  <Flex as={as} mb={8}>
    <DetailsSubSection label="Preview">
      <VideoPreview videoTrack={videoLayer.track} isDisabled={disablePreview} />
    </DetailsSubSection>

    <DetailsSubSection label="Position">
      <Box my="auto">
        <AnchorChooser
          selectedValue={videoLayer.anchor}
          onAnchorChange={onAnchorChange}
        />
      </Box>
    </DetailsSubSection>

    <DetailsSubSection label="Size">
      <VideoSizeSelector
        naturalSize={videoLayer.naturalSize}
        outputSize={outputSize}
        onSizeChange={onSizeChange}
      />
    </DetailsSubSection>

    <DetailsSubSection label="Info">
      <Stack align="flex-start" flexWrap="wrap">
        <Badge variantColor="pink">{videoLayer.source}</Badge>
        {videoLayer.deviceInfo && (
          <Badge variantColor="orange">
            {videoLayer.deviceInfo.label || "Unlabeled Device"}
          </Badge>
        )}
        <Badge variantColor="teal">
          {videoLayer.settings.width}x{videoLayer.settings.height}
        </Badge>
        <Badge variantColor="cyan">{videoLayer.settings.frameRate}fps</Badge>

        {(videoLayer.settings as FakeSharedScreenTrackSettings)
          .displaySurface && (
          <Badge variantColor="purple">
            {
              (videoLayer.settings as FakeSharedScreenTrackSettings)
                .displaySurface
            }
          </Badge>
        )}
      </Stack>
    </DetailsSubSection>

    <Flex direction="column" alignSelf="center" marginLeft="auto">
      <IconButton
        icon="triangle-up"
        title="Move layer up"
        aria-label="Move layer up"
        variant="ghost"
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        onClick={() => onLayerMoved("up")}
      />
      <IconButton
        icon="triangle-down"
        title="Move layer down"
        aria-label="Move layer down"
        variant="ghost"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={() => onLayerMoved("down")}
      />
    </Flex>

    <IconButton
      aria-label="Remove track"
      title="Remove track"
      icon="close"
      variant="ghost"
    />
  </Flex>
);

export default VideoDetails;
