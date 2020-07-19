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
  { onStreamAdded: (stream: MediaStream) => void } & ButtonProps
> = ({ onStreamAdded, children, ...buttonProps }) => {
  const [mediaDevices, updateMediaDevices] = useMediaDevices();
  const inputDevices = useMemo(() => mediaDevices?.filter(isInputDevice), [
    mediaDevices,
  ]);

  const getTracksFromDevice = async (deviceInfo: MediaDeviceInfo) => {
    const kind = deviceInfo.kind.includes("video") ? "video" : "audio";
    const idKey = deviceInfo.deviceId ? "deviceId" : "groupId";

    const stream = await navigator.mediaDevices.getUserMedia({
      [kind]: { [idKey]: { exact: deviceInfo[idKey] } },
    });
    onStreamAdded(stream);
  };

  const noInputsYet = !inputDevices || inputDevices.length === 0;
  return (
    <Menu>
      <MenuButton
        as={Button}
        {...buttonProps}
        // @ts-ignore
        isDisabled={noInputsYet}
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
