import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/core";

const useVideoSizeState = (naturalWidth: number, naturalHeight: number) => {
  const aspectRatio = naturalWidth / naturalHeight;
  const [width, setWidth] = useState(naturalWidth);
  const [height, setHeight] = useState(naturalHeight);

  const onWidthChange = useCallback(
    (newWidth: number | string) => {
      if (typeof newWidth === "string") {
        return;
      }
      setWidth(newWidth);
      setHeight(Math.floor(newWidth / aspectRatio));
    },
    [aspectRatio, setWidth, setHeight]
  );

  const onHeightChange = useCallback(
    (newHeight: number | string) => {
      if (typeof newHeight === "string") {
        return;
      }
      setHeight(newHeight);
      setWidth(Math.floor(newHeight * aspectRatio));
    },
    [aspectRatio, setWidth, setHeight]
  );

  const reset = useCallback(() => {
    setWidth(naturalWidth);
    setHeight(naturalHeight);
  }, [naturalWidth, naturalHeight]);

  return { width, height, onWidthChange, onHeightChange, reset };
};

const VideoSizeSelector: React.FC<{
  naturalWidth: number;
  naturalHeight: number;
  onSizeChange: (width: number, height: number) => void;
}> = ({ naturalWidth, naturalHeight, onSizeChange }) => {
  const {
    width,
    height,
    onWidthChange,
    onHeightChange,
    reset,
  } = useVideoSizeState(naturalWidth, naturalHeight);

  useEffect(() => {
    if (width !== naturalWidth || height !== naturalHeight) {
      onSizeChange(width, height);
    }
  }, [naturalWidth, naturalHeight, width, height, onSizeChange]);

  return (
    <form>
      <FormControl>
        <FormLabel>
          Width:
          <NumberInput value={width} min={1} onChange={onWidthChange}>
            <NumberInputField width="9ch" />
          </NumberInput>
        </FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel>
          Height:
          <NumberInput value={height} min={1} onChange={onHeightChange}>
            <NumberInputField width="9ch" />
          </NumberInput>
        </FormLabel>
      </FormControl>
      <FormControl>
        <Button type="reset" leftIcon="repeat" onClick={reset}>
          Use Natural Size
        </Button>
      </FormControl>
    </form>
  );
};

export default VideoSizeSelector;
