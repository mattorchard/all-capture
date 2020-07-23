import React, { useCallback, useEffect, useRef, useState } from "react";
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
  naturalWidth: number,
  naturalHeight: number,
  onSizeChange: (size: Size) => void
) => {
  const aspectRatio = naturalWidth / naturalHeight;
  const [width, setWidthOnly] = useState(naturalWidth);
  const [height, setHeightOnly] = useState(naturalHeight);
  const onSizeChangeCallbackRef = useRef(onSizeChange);
  onSizeChangeCallbackRef.current = onSizeChange;

  useEffect(() => {
    onSizeChangeCallbackRef.current({ width, height });
  }, [width, height]);

  const setWidth = useCallback(
    (newWidth: number | string) => {
      if (typeof newWidth === "string") {
        return;
      }
      setWidthOnly(newWidth);
      setHeightOnly(Math.floor(newWidth / aspectRatio));
    },
    [aspectRatio, setWidthOnly, setHeightOnly]
  );

  const setHeight = useCallback(
    (newHeight: number | string) => {
      if (typeof newHeight === "string") {
        return;
      }
      setHeightOnly(newHeight);
      setWidthOnly(Math.floor(newHeight * aspectRatio));
    },
    [aspectRatio, setWidthOnly, setHeightOnly]
  );

  const reset = useCallback(() => {
    setWidthOnly(naturalWidth);
    setHeightOnly(naturalHeight);
  }, [naturalWidth, naturalHeight]);

  return { width, height, setWidth, setHeight, reset };
};

const VideoSizeSelector: React.FC<{
  naturalWidth: number;
  naturalHeight: number;
  onSizeChange: (size: Size) => void;
}> = ({ naturalWidth, naturalHeight, onSizeChange }) => {
  const { width, height, setWidth, setHeight, reset } = useVideoSizeState(
    naturalWidth,
    naturalHeight,
    onSizeChange
  );

  return (
    <form>
      <Flex justify="space-between">
        <FormControl>
          <FormLabel>
            Width:
            <NumberInput value={width} min={1} onChange={setWidth}>
              <NumberInputField width="9ch" />
            </NumberInput>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel>
            Height:
            <NumberInput value={height} min={1} onChange={setHeight}>
              <NumberInputField width="9ch" />
            </NumberInput>
          </FormLabel>
        </FormControl>
      </Flex>
      <FormControl>
        <Button type="reset" leftIcon="repeat" onClick={reset}>
          Use Natural Size
        </Button>
      </FormControl>
    </form>
  );
};

export default VideoSizeSelector;
