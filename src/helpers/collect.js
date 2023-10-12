import { measureRequestDispatch, measureRequestResponse } from "./measure.js";

const responses = [];
let lastCollectionId = 0;

const getCollectionId = () => lastCollectionId++;

export const collect = async (request) => {
  const collectionId = getCollectionId();
  measureRequestDispatch(collectionId);
  const response = await request;
  measureRequestResponse();
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
  console.table({
    responsesCount: responses.length,
    totalScore: responses.reduce((acc, { score }) => acc + score, 0),
    failedResponsesCount: responses.filter(({ score }) => score < 0).length,
  });
};
