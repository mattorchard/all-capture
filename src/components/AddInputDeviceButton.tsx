import React, { useMemo } from "react";
import useMediaDevices from "../hooks/useMediaDevices";
import {
  Badge,
  BadgeProps,
  Button,
  ButtonProps,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/core";
import { AnnotatedTrack } from "../types/MediaTypes";

const getConstraintsForDeviceInfo = (
  deviceInfo: MediaDeviceInfo
): MediaStreamConstraints => {
  const idToUse = deviceInfo.deviceId ? "deviceId" : "groupId";

  if (deviceInfo.kind.includes("video")) {
    return {
      video: {
        [idToUse]: { exact: deviceInfo[idToUse] },
        width: 1920, // Preferred width
      },
      audio: false,
    };
  } else if (deviceInfo.kind.includes("audio")) {
    return {
      audio: {
        [idToUse]: { exact: deviceInfo[idToUse] },
      },
      video: false,
    };
  } else {
    throw new Error(
      `Unrecognized device kind "${deviceInfo.kind}", expected video or audio`
    );
  }
};

const isInputDevice = (deviceInfo: MediaDeviceInfo) =>
  deviceInfo.kind.toLowerCase().includes("input");

const InputKindBadge: React.FC<{ kind: string } & BadgeProps> = ({
  kind,
  ...props
}) => {
  switch (kind.toLowerCase()) {
    case "audioinput":
      return (
        <Badge variantColor="orange" {...props}>
          Audio
        </Badge>
      );
    case "videoinput":
      return (
        <Badge variantColor="teal" {...props}>
          Video
        </Badge>
      );
    default:
      return (
        <Badge variantColor="red" {...props}>
          Unknown Type
        </Badge>
      );
  }
};

const AddInputDeviceButton: React.FC<
  { onTracksAdded: (annotatedTracks: AnnotatedTrack[]) => void } & ButtonProps
> = ({ onTracksAdded, children, ...buttonProps }) => {
  const [mediaDevices, updateMediaDevices] = useMediaDevices();
  const inputDevices = useMemo(() => mediaDevices?.filter(isInputDevice), [
    mediaDevices,
  ]);

  const getTracksFromDevice = async (deviceInfo: MediaDeviceInfo) => {
    const stream = await navigator.mediaDevices.getUserMedia(
      getConstraintsForDeviceInfo(deviceInfo)
    );
    const annotatedTracks: AnnotatedTrack[] = stream
      .getTracks()
      .map((track) => ({
        track,
        deviceInfo,
        settings: track.getSettings(),
        source: "input-device",
      }));
    onTracksAdded(annotatedTracks);
  };

  const noInputsYet = !inputDevices || inputDevices.length === 0;
  return (
    <Menu>
      <MenuButton
        as={Button}
        {...buttonProps}
        // @ts-ignore
        isDisabled={noInputsYet || buttonProps.isDisabled}
        leftIcon="add"
        rightIcon="chevron-down"
      >
        {children}
      </MenuButton>

      <MenuList>
        {noInputsYet || (
          <>
            {inputDevices!.map((deviceInfo, index) => (
              <MenuItem
                onClick={() => getTracksFromDevice(deviceInfo)}
                key={deviceInfo.deviceId || deviceInfo.groupId || index}
              >
                {deviceInfo.label || "Unlabeled Device"}{" "}
                <InputKindBadge kind={deviceInfo.kind} ml={2} />
              </MenuItem>
            ))}
          </>
        )}
        <MenuItem onClick={updateMediaDevices}>
          <Icon name="settings" mr={2} />
          Refresh Device List
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddInputDeviceButton;
