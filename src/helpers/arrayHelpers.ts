export const swapValues = <T>(
  array: T[],
  indexA: number,
  indexB: number
): T[] => {
  if (
    indexA < 0 ||
    indexB < 0 ||
    indexA >= array.length ||
    indexB >= array.length
  ) {
    throw new Error(
      `Index out of bounds, cannot swap index ${indexA} and ${indexB} in array of ${array.length} items`
    );
  }
  if (indexA === indexB) {
    return array;
  }
  const newArray = [...array];
  newArray[indexA] = array[indexB];
  newArray[indexB] = array[indexA];
  return newArray;
};
