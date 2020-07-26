import React, { useState } from "react";
import { AudioLayer } from "../types/MediaTypes";
import {
  Badge,
  Button,
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tooltip,
} from "@chakra-ui/core";
import AudioPreview from "./AudioPreview";
import { DetailsSubSection } from "./DetailsSubSection";

const AudioDetails: React.FC<{
  audioLayer: AudioLayer;
  as: React.ElementType;
  disablePreview?: boolean;
  onGainChange: (gain: number) => void;
  onMuteToggle: () => void;
  onRemoveTrack: () => void;
}> = ({
  audioLayer,
  as,
  onGainChange,
  onMuteToggle,
  onRemoveTrack,
  disablePreview = false,
}) => {
  const [gainState, setGainState] = useState<number | string>(audioLayer.gain);
  return (
    <Flex as={as} mb={8}>
      <DetailsSubSection label="Preview">
        <AudioPreview
          key={audioLayer.track.id}
          audioTrack={audioLayer.track}
          isDisabled={disablePreview}
          gain={audioLayer.gain}
          backgroundColor="#1A202C"
          barColor="#553c9a"
        />
      </DetailsSubSection>
      <DetailsSubSection label="Volume">
        <Flex>
          <NumberInput
            value={gainState}
            min={0}
            max={20}
            step={0.1}
            width="10ch"
            onChange={(gain) => {
              setGainState(gain);
              if (typeof gain === "number") {
                onGainChange(gain);
              }
            }}
          >
            <NumberInputField
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button
            onClick={onMuteToggle}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            variantColor={audioLayer.muted ? "blue" : "red"}
            variant="outline"
          >
            {audioLayer.muted ? "Unmute" : "Mute"}
          </Button>
        </Flex>
      </DetailsSubSection>
      <DetailsSubSection label="Info">
        <Stack align="flex-start" flexWrap="wrap">
          <Badge variantColor="pink">{audioLayer.source}</Badge>
          {audioLayer.deviceInfo && (
            <Badge
              variantColor="orange"
              title={audioLayer.deviceInfo.label}
              style={{
                maxWidth: "40ch",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {audioLayer.deviceInfo.label || "Unlabeled Device"}
            </Badge>
          )}
          <Badge variantColor="teal">
            {audioLayer.settings.channelCount === 2 ? "Stereo" : "Mono"}
          </Badge>
          <Badge variantColor="cyan">{audioLayer.settings.sampleRate}Hz</Badge>
          {audioLayer.settings.noiseSuppression && (
            <Badge variantColor="purple">Noise Suppression</Badge>
          )}
        </Stack>
      </DetailsSubSection>

      <Tooltip
        aria-label="Remove track"
        label="Remove track"
        placement="left"
        hasArrow
      >
        <IconButton
          onClick={onRemoveTrack}
          aria-label="Remove track"
          icon="close"
          variant="ghost"
          ml="auto"
        />
      </Tooltip>
    </Flex>
  );
};

export default AudioDetails;
