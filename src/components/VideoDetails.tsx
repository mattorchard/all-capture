import React from "react";
import VideoPreview from "./VideoPreview";
import AnchorChooser from "./AnchorChooser";
import {
  Badge,
  Flex,
  FlexProps,
  Heading,
  IconButton,
  Stack,
} from "@chakra-ui/core";
import { AnchorValue, Size, VideoLayer } from "../types/MediaTypes";
import VideoSizeSelector from "./VideoSizeSelector";

const VideoDetailsSection: React.FC<{ label: string } & FlexProps> = ({
  label,
  children,
  ...props
}) => {
  return (
    <Flex align="center" direction="column" mr={8} {...props}>
      <Heading
        as="h4"
        size="sm"
        mb={2}
        alignSelf="flex-start"
        borderBottomWidth={2}
      >
        {label}
      </Heading>
      {children}
    </Flex>
  );
};

const VideoDetails: React.FC<{
  videoLayer: VideoLayer;
  as: React.ElementType;
  onAnchorChange: (anchor: AnchorValue) => void;
  onSizeChange: (size: Size) => void;
  disablePreview?: boolean;
}> = ({
  videoLayer,
  as,
  onSizeChange,
  onAnchorChange,
  disablePreview = false,
}) => (
  <Stack as={as} isInline marginBottom={8}>
    <VideoDetailsSection label="Preview">
      <VideoPreview videoTrack={videoLayer.track} isDisabled={disablePreview} />
    </VideoDetailsSection>

    <VideoDetailsSection label="Position">
      <AnchorChooser
        selectedValue={videoLayer.anchor}
        onAnchorChange={onAnchorChange}
      />
    </VideoDetailsSection>

    <VideoDetailsSection label="Size">
      <VideoSizeSelector
        naturalWidth={videoLayer.settings.width || 1920}
        naturalHeight={videoLayer.settings.height || 1080}
        onSizeChange={onSizeChange}
      />
    </VideoDetailsSection>

    <VideoDetailsSection label="Info">
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
      </Stack>
    </VideoDetailsSection>

    <Flex direction="column" alignSelf="center" marginLeft="auto">
      <IconButton
        icon="triangle-up"
        title="Move layer up"
        aria-label="Move layer up"
        variant="ghost"
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      />
      <IconButton
        icon="triangle-down"
        title="Move layer down"
        aria-label="Move layer down"
        variant="ghost"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
    </Flex>
  </Stack>
);

export default VideoDetails;
