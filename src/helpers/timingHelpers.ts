export const debounce = <A extends any[]>(
  callback: (...someArgs: A) => void,
  debounceDelay: number
) => {
  let timeoutId: number | null = null;
  return (...args: A) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => callback(...args), debounceDelay);
  };
};
