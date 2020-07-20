export const queryAncestor = (
  node: Node | null,
  querySelector: string
): HTMLElement | null => {
  if (!node) {
    return null;
  }
  if (node instanceof Element) {
    return node.closest(querySelector) || null;
  }
  return node.parentElement?.closest(querySelector) || null;
};
