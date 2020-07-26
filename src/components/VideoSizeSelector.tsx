import React, { useRef, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/core";
import { Size } from "../types/MediaTypes";

const useVideoSizeState = (
  naturalSize: Size,
  outputSize: Size,
  onSizeChange: (size: Size) => void
) => {
  const { width: naturalWidth, height: naturalHeight } = naturalSize;
  const { width: outputWidth, height: outputHeight } = outputSize;
  const aspectRatio = naturalWidth / naturalHeight;

  const [width, setWidthOnly] = useState<number | string>(naturalWidth);
  const [height, setHeightOnly] = useState<number | string>(naturalHeight);
  const onSizeChangeCallbackRef = useRef(onSizeChange);
  onSizeChangeCallbackRef.current = onSizeChange;

  const setSize = (width: number, height: number) => {
    setWidthOnly(width);
    setHeightOnly(height);
    onSizeChange({ width, height });
  };

  const setWidth = (newWidth: number | string) => {
    if (typeof newWidth === "string") {
      setWidthOnly(newWidth);
    } else {
      setSize(newWidth, Math.floor(newWidth / aspectRatio));
    }
  };

  const setHeight = (newHeight: number | string) => {
    if (typeof newHeight === "string") {
      setHeightOnly(newHeight);
    } else {
      setSize(Math.floor(newHeight * aspectRatio), newHeight);
    }
  };

  const fitToOutput = () => {
    const outputAspectRatio = outputWidth / outputHeight;
    if (aspectRatio >= outputAspectRatio) {
      // Track is a wide boi
      setWidth(outputWidth);
    } else {
      // Track is a tall boi
      setHeight(outputHeight);
    }
  };

  return { width, height, setWidth, setHeight, fitToOutput };
};

const VideoSizeSelector: React.FC<{
  naturalSize: Size;
  outputSize: Size;
  onSizeChange: (size: Size) => void;
}> = ({ naturalSize, outputSize, onSizeChange }) => {
  const { width, height, setWidth, setHeight, fitToOutput } = useVideoSizeState(
    naturalSize,
    outputSize,
    onSizeChange
  );

  return (
    <Flex as="form" direction="column">
      <Flex justify="space-between">
        <FormControl>
          <FormLabel>
            Width
            <NumberInput value={width} min={1} onChange={setWidth}>
              <NumberInputField width="9ch" />
            </NumberInput>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel pr={0}>
            Height
            <NumberInput value={height} min={1} onChange={setHeight}>
              <NumberInputField width="9ch" />
            </NumberInput>
          </FormLabel>
        </FormControl>
      </Flex>
      <Button leftIcon="plus-square" onClick={fitToOutput}>
        Fit to Output
      </Button>
    </Flex>
  );
};

export default VideoSizeSelector;
