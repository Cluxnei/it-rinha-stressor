export const createChunk = (entries, size, itemCallable) => {
  return new Array(Math.min(size, entries.length))
    .fill(0)
    .map(() => itemCallable(entries.pop()));
};
