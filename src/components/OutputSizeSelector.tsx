import React, { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/core";
import { Size } from "../types/MediaTypes";

const ResolutionSizes: { [name: string]: Size } = {
  "1080p": { width: 1920, height: 1080 },
  "720p": { width: 1280, height: 720 },
  "480p": { width: 640, height: 480 },
};

const useCustomWidth = (onSizeChange: (size: Size) => void) => {
  const [width, setRawWidth] = useState<string | number>("");
  const [height, setRawHeight] = useState<string | number>("");

  return {
    width,
    height,
    onWidthChange: (newWidth: string | number) => {
      setRawWidth(newWidth);
      if (typeof newWidth === "number" && typeof height === "number") {
        onSizeChange({ width: newWidth, height });
      }
    },
    onHeightChange: (newHeight: string | number) => {
      setRawHeight(newHeight);
      if (typeof newHeight === "number" && typeof width === "number") {
        onSizeChange({ height: newHeight, width });
      }
    },
  };
};

const OutputSizeSelector: React.FC<{
  onSizeChange: (size: "auto" | Size) => void;
}> = ({ onSizeChange }) => {
  const [sizeOption, setSizeOption] = useState("auto");
  const { width, height, onWidthChange, onHeightChange } = useCustomWidth(
    onSizeChange
  );

  return (
    <Flex as="form" align="center">
      <FormControl>
        <FormLabel fontSize="sm">
          Output Size
          <Select
            value={sizeOption}
            onChange={(event) => {
              const sizeOption = event.currentTarget.value;
              setSizeOption(sizeOption);
              if (sizeOption === "auto") {
                onSizeChange("auto");
              } else if (
                sizeOption === "custom" &&
                typeof width === "number" &&
                typeof height === "number"
              ) {
                onSizeChange({ width, height });
              } else if (sizeOption in ResolutionSizes) {
                const size = ResolutionSizes[sizeOption];
                onSizeChange(size);
              }
            }}
            size="sm"
          >
            <option value="auto">Auto Size</option>
            <option value="1080p">1920&times;1080</option>
            <option value="720p">1280&times;720</option>
            <option value="480p">640&times;480</option>
            <option value="custom">Custom</option>
          </Select>
        </FormLabel>
      </FormControl>
      {sizeOption === "custom" && (
        <>
          <FormControl>
            <FormLabel fontSize="sm">
              Width
              <NumberInput value={width} onChange={onWidthChange}>
                <NumberInputField size="sm" variant="flushed" width="10ch" />
              </NumberInput>
            </FormLabel>
          </FormControl>
          <Icon
            name="small-close"
            aria-label="&times;"
            mr={3}
            mb={3}
            alignSelf="flex-end"
          />
          <FormControl>
            <FormLabel fontSize="sm">
              Height
              <NumberInput value={height} onChange={onHeightChange}>
                <NumberInputField size="sm" variant="flushed" width="10ch" />
              </NumberInput>
            </FormLabel>
          </FormControl>
        </>
      )}
    </Flex>
  );
};

export default OutputSizeSelector;
