import { useEffect, useState } from "react";
import useIncrement from "./useIncrement";

const useMediaDevices = (): [MediaDeviceInfo[] | null, () => void] => {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);
  const [refreshId, incrementRefreshId] = useIncrement(0);

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => cancelled || setDevices(devices))
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [refreshId]);

  return [devices, incrementRefreshId];
};

export default useMediaDevices;
