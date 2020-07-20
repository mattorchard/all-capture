import React, { CSSProperties } from "react";
import { Grid, IconButton } from "@chakra-ui/core";
import { Icons } from "@chakra-ui/core/dist/theme/icons";
import { queryAncestor } from "../helpers/domHelpers";

type AnchorValue =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "middle-left"
  | "middle-middle"
  | "middle-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right";

interface AnchorDetails {
  label: string;
  value: AnchorValue;
  icon: Icons;
  rotation: string | null;
}

const anchorDetailOptions: AnchorDetails[] = [
  {
    label: "Top left",
    value: "top-left",
    icon: "arrow-up",
    rotation: "-45deg",
  },
  {
    label: "Top middle",
    value: "top-middle",
    icon: "arrow-up",
    rotation: null,
  },
  {
    label: "Top right",
    value: "top-right",
    icon: "arrow-up",
    rotation: "45deg",
  },
  {
    label: "Middle left",
    value: "middle-left",
    icon: "arrow-back",
    rotation: null,
  },
  {
    label: "Middle middle",
    value: "middle-middle",
    icon: "add",
    rotation: null,
  },
  {
    label: "Middle right",
    value: "middle-right",
    icon: "arrow-forward",
    rotation: null,
  },
  {
    label: "Bottom left",
    value: "bottom-left",
    icon: "arrow-down",
    rotation: "45deg",
  },
  {
    label: "Bottom middle",
    value: "bottom-middle",
    icon: "arrow-down",
    rotation: null,
  },
  {
    label: "Bottom right",
    value: "bottom-right",
    icon: "arrow-down",
    rotation: "-45deg",
  },
];

const AnchorChooser: React.FC<{
  selectedValue: AnchorValue;
  onAnchorChange: (selectedValue: AnchorValue) => void;
  isDisabled?: boolean;
}> = ({ selectedValue, onAnchorChange, isDisabled }) => (
  <Grid
    templateRows="auto auto auto"
    templateColumns="auto auto auto"
    onClick={(event) => {
      const nearestAnchorButton = queryAncestor(
        event.target as Node,
        "[data-anchor]"
      );
      if (nearestAnchorButton) {
        const anchorValue = nearestAnchorButton.dataset.anchor as AnchorValue;
        onAnchorChange(anchorValue);
      }
    }}
    borderRadius=".25rem"
    overflow="hidden"
  >
    {anchorDetailOptions.map((anchorDetails) => (
      <IconButton
        borderRadius={0}
        bg={anchorDetails.value === selectedValue ? "gray.700" : "gray.800"}
        aria-label={anchorDetails.label}
        data-anchor={anchorDetails.value}
        icon={anchorDetails.icon}
        className="rotated-icon-button"
        style={{ "--rotation": anchorDetails.rotation || 0 } as CSSProperties}
        isDisabled={isDisabled}
      />
    ))}
  </Grid>
);

export default AnchorChooser;
