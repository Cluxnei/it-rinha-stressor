import { measureRequestDispatch, measureRequestResponse } from "./measure.js";

const responses = [];
const errors = [];
export const collectError = (error) => {
  errors.push(error);
};

export const collect = async (request) => {
  measureRequestDispatch();
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

const getErrorsTable = (entries, includeBody = false) => {
  const expectedVsReceived = [];
  for (const entry of entries) {
    const { status, expectedStatus, responseBody, requestBody } = entry;
    const measured = expectedVsReceived.find(
      (measure) => measure.expected === expectedStatus,
    );
    if (!measured) {
      expectedVsReceived.push({
        expected: expectedStatus,
        received: new Set([status]),
        responses: includeBody ? [{ responseBody, requestBody }] : [],
      });
      continue;
    }
    measured.received.add(status);
    if (includeBody) {
      measured.responses.push({ responseBody, requestBody });
    }
  }
  return expectedVsReceived;
};

export const showCollection = () => {
  const failedResponses = responses.filter(({ score }) => score < 0);
  console.table(
    [
      { metric: "responsesCount", value: responses.length },
      {
        metric: "totalScore",
        value: responses.reduce((acc, { score }) => acc + score, 0),
      },
      { metric: "failedResponsesCount", value: failedResponses.length },
      {
        metric: "failedResponseStatus",
        value: new Set(
          failedResponses.map(
            ({ response: { responseStatus } }) => responseStatus,
          ),
        ),
      },
    ],
    ["metric", "value"],
  );
  console.log("showing errors...");
  console.table(getErrorsTable(errors), ["expected", "received"]);
  console.log("showing failed...");
  console.table(
    getErrorsTable(
      failedResponses.map(
        ({
          response: {
            responseStatus,
            expectedStatus,
            responseBody,
            requestBody,
          },
        }) => ({
          status: responseStatus,
          expectedStatus,
          responseBody,
          requestBody,
        }),
      ),
      true,
    ).map((r) => ({ ...r, responses: JSON.stringify(r.responses) })),
    ["expected", "received", "responses"],
  );
};
