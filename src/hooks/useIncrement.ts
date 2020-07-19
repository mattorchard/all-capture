import { useCallback, useState } from "react";

const useIncrement = (initialValue: number): [number, () => void] => {
  const [state, setState] = useState(initialValue);
  const increment = useCallback(() => setState((state) => state + 1), []);
  return [state, increment];
};

export default useIncrement;
