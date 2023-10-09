const responses = [];

export const collect = async (request) => {
  console.log("collecting request");
  const response = await request;
  const { points, matchStatus, matchBody, needsMatchBody } = response;
  let assertPoint = true;
  if (!matchStatus || (needsMatchBody && !matchBody)) {
    assertPoint = false;
  }
  const score = assertPoint ? points : -points;
  const r = {
    response,
    score,
  };
  console.log(r);
  responses.push(r);
};

export const collectAll = async (requests) => {
  const results = await Promise.allSettled(
    requests.map((request) => collect(request)),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      throw new Error(result.reason);
    }
  }
  return results.map((result) => result.value);
};

export const showCollection = () => {
  console.log({
    responsesCount: responses.length,
    totalScore: responses.reduce((acc, { score }) => acc + score, 0),
    failedResponses: responses.filter(({ score }) => score < 0),
  });
};
