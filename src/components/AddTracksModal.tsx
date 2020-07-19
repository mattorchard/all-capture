import React, { useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useToast,
} from "@chakra-ui/core";
import useMediaDevices from "../hooks/useMediaDevices";

const isInputDevice = (deviceInfo: MediaDeviceInfo) =>
  deviceInfo.kind.toLowerCase().includes("input");

const InputKindBadge: React.FC<{ kind: string }> = ({ kind }) => {
  switch (kind.toLowerCase()) {
    case "audioinput":
      return <Badge variantColor="orange">Audio</Badge>;
    case "videoinput":
      return <Badge variantColor="teal">Video</Badge>;
    default:
      return <Badge variantColor="red">Unknown Type</Badge>;
  }
};

const AddTracksModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddedTracks: (tracks: MediaStreamTrack[]) => void;
}> = ({ isOpen, onClose, onAddedTracks }) => {
  const [isLoadingComputerStream, setIsLoadingComputerStream] = useState(false);
  const [mediaDevices] = useMediaDevices();
  const inputDevices = mediaDevices?.filter(isInputDevice);
  const toast = useToast();

  const requestRecordComputer = async () => {
    try {
      setIsLoadingComputerStream(true);
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      // In try and catch as placing in finally triggers after unmount
      setIsLoadingComputerStream(false);

      onClose();
      onAddedTracks(stream.getTracks());
    } catch (error) {
      console.error("Unable to get display media", error);
      toast({
        status: "error",
        title: "Error",
        description: "Error, unable trying to record computer",
        position: "top",
      });
      // In try and catch as placing in finally triggers after unmount
      setIsLoadingComputerStream(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Tracks</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ButtonGroup>
            <Button
              onClick={requestRecordComputer}
              isLoading={isLoadingComputerStream}
            >
              Record Computer
            </Button>

            {inputDevices ? (
              <FormControl>
                <CheckboxGroup
                  defaultValue={inputDevices.map(
                    (deviceInfo) => deviceInfo.deviceId
                  )}
                >
                  {inputDevices.map((deviceInfo) => (
                    <Checkbox
                      key={deviceInfo.deviceId}
                      value={deviceInfo.deviceId}
                      isDisabled={isLoadingComputerStream}
                    >
                      {deviceInfo.label || "Unlabeled Device"}
                      <InputKindBadge kind={deviceInfo.kind} />
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </FormControl>
            ) : (
              <>
                <Skeleton height="1em" my={2} />
                <Skeleton height="1em" my={2} />
                <Skeleton />
              </>
            )}
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTracksModal;
