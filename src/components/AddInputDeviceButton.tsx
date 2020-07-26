import React, { useMemo, useState } from "react";
import useMediaDevices from "../hooks/useMediaDevices";
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tooltip,
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

const AddInputDeviceButton: React.FC<{
  onTracksAdded: (annotatedTracks: AnnotatedTrack[]) => void;
  isDisabled?: boolean;
}> = ({ onTracksAdded, isDisabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [mediaDevices, updateMediaDevices] = useMediaDevices();
  const [devicesUpdatedMessage, setDevicesUpdatedMessage] = useState(false);

  const { audioInputDevices, videoInputDevices } = useMemo(() => {
    const audioInputDevices: MediaDeviceInfo[] = [];
    const videoInputDevices: MediaDeviceInfo[] = [];

    mediaDevices.forEach((deviceInfo) => {
      if (deviceInfo.kind.toLowerCase() === "audioinput") {
        audioInputDevices.push(deviceInfo);
      } else if (deviceInfo.kind.toLowerCase() === "videoinput") {
        videoInputDevices.push(deviceInfo);
      }
    });

    return { audioInputDevices, videoInputDevices };
  }, [mediaDevices]);

  const handleRequestRefreshDevices = async () => {
    try {
      setLoading(true);
      await updateMediaDevices();
      setDevicesUpdatedMessage(true);
    } finally {
      setLoading(false);
    }
  };

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
      <Tooltip
        aria-label="Devices updated"
        label="Devices updated"
        isOpen={devicesUpdatedMessage}
        onClose={() => setDevicesUpdatedMessage(false)}
        placement="left"
        hasArrow
      >
        {audioInputDevices.length + videoInputDevices.length === 0 ? (
          <Button
            onClick={handleRequestRefreshDevices}
            variantColor="blue"
            isLoading={loading}
            loadingText="Refreshing devices"
          >
            Grant Camera and Mic Permission
          </Button>
        ) : (
          <MenuButton
            as={Button}
            // @ts-ignore
            isDisabled={isDisabled}
            leftIcon="add"
            rightIcon="chevron-down"
          >
            Add Input device
          </MenuButton>
        )}
      </Tooltip>
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

        <MenuItem onClick={handleRequestRefreshDevices}>
          <Icon name="settings" mr={2} />
          Refresh Device List
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddInputDeviceButton;
