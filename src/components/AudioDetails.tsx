import React from "react";
import { AudioLayer } from "../types/MediaTypes";
import {
  Badge,
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/core";
import AudioPreview from "./AudioPreview";
import { DetailsSubSection } from "./DetailsSubSection";

const AudioDetails: React.FC<{
  audioLayer: AudioLayer;
  as: React.ElementType;
  disablePreview?: boolean;
}> = ({ audioLayer, as, disablePreview = false }) => (
  <Flex as={as}>
    <DetailsSubSection label="Preview">
      <AudioPreview
        key={audioLayer.track.id}
        audioTrack={audioLayer.track}
        isDisabled={disablePreview}
        backgroundColor="#1A202C"
        barColor="#553c9a"
      />
    </DetailsSubSection>
    <DetailsSubSection label="Volume">
      <Flex>
        <NumberInput defaultValue={1} min={0} max={20} step={0.1} width="10ch">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button>{audioLayer.muted ? "Unmute" : "Mute"}</Button>
      </Flex>
    </DetailsSubSection>
    <DetailsSubSection label="Info">
      <Stack align="flex-start" flexWrap="wrap">
        <Badge variantColor="pink">{audioLayer.source}</Badge>
        {audioLayer.deviceInfo && (
          <Badge variantColor="orange">
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
  </Flex>
);

export default AudioDetails;
