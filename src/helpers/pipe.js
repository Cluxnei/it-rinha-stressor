export const pipeAll = async (pipeline) => {
  const results = await Promise.allSettled(pipeline);
  for (const result of results) {
    if (result.status === "rejected") {
      throw new Error(result.reason);
    }
  }
  return results.map((result) => result.value);
};
