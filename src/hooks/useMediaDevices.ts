import { useEffect, useState } from "react";

const useMediaDevices = (): [MediaDeviceInfo[], () => Promise<void>] => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const updateDevices = async () => {
    if (devices.length === 0) {
      const dummyStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      dummyStream.getTracks().forEach((track) => track.stop());
    }
    setDevices(await navigator.mediaDevices.enumerateDevices());
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (devices.some((device) => device.deviceId)) {
        setDevices(devices);
      }
    });
  }, []);

  return [devices, updateDevices];
};

export default useMediaDevices;
