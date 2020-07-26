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
  MenuDivider,
  MenuGroup,
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

const AddInputDeviceButton: React.FC<
  { onTracksAdded: (annotatedTracks: AnnotatedTrack[]) => void } & ButtonProps
> = ({ onTracksAdded, children, ...buttonProps }) => {
  const [mediaDevices, updateMediaDevices] = useMediaDevices();
  const { audioInputDevices, videoInputDevices } = useMemo(() => {
    const audioInputDevices: MediaDeviceInfo[] = [];
    const videoInputDevices: MediaDeviceInfo[] = [];

    mediaDevices?.forEach((deviceInfo) => {
      if (deviceInfo.kind.toLowerCase() === "audioinput") {
        audioInputDevices.push(deviceInfo);
      } else if (deviceInfo.kind.toLowerCase() === "videoinput") {
        videoInputDevices.push(deviceInfo);
      }
    });

    return { audioInputDevices, videoInputDevices };
  }, [mediaDevices]);

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

  return (
    <Menu>
      <MenuButton
        as={Button}
        {...buttonProps}
        // @ts-ignore
        isDisabled={buttonProps.isDisabled}
        leftIcon="add"
        rightIcon="chevron-down"
      >
        {children}
      </MenuButton>

      <MenuList>
        {videoInputDevices.length > 0 && (
          <>
            <MenuGroup title="Video">
              {videoInputDevices!.map((deviceInfo, index) => (
                <MenuItem
                  onClick={() => getTracksFromDevice(deviceInfo)}
                  key={deviceInfo.deviceId || deviceInfo.groupId || index}
                >
                  {deviceInfo.label || "Unlabeled Camera"}
                </MenuItem>
              ))}
            </MenuGroup>
            <MenuDivider />
          </>
        )}
        {audioInputDevices.length > 0 && (
          <>
            <MenuGroup title="Audio">
              {audioInputDevices!.map((deviceInfo, index) => (
                <MenuItem
                  onClick={() => getTracksFromDevice(deviceInfo)}
                  key={deviceInfo.deviceId || deviceInfo.groupId || index}
                >
                  {deviceInfo.label || "Unlabeled Microphone"}
                </MenuItem>
              ))}
            </MenuGroup>
            <MenuDivider />
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
