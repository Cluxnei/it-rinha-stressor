import {
  HTTP_STATUS_CODE_POINTS,
  SEARCH_EXECUTION_RPS,
} from "../../constants/general.js";
import { faker } from "@faker-js/faker";
import { delay } from "../delay.js";
import { collectAll } from "../collect.js";
import { doSearchRequest } from "../requests/doSearchRequest.js";

const doUnsearchableRequest = async (term) => {
  let status = "unknown";
  let body = null;
  try {
    const response = await doSearchRequest(term);
    status = response.status;
    body = await response.json();
  } catch (error) {}
  return {
    points: HTTP_STATUS_CODE_POINTS[String(status)],
    matchStatus: status === 200,
    matchBody: body && Array.isArray(body) && body.length === 0,
    needsMatchBody: true,
  };
};

const createChunk = (terms, processesCount) => {
  return new Array(Math.min(processesCount, terms.length))
    .fill(0)
    .map(() => doUnsearchableRequest(terms.pop()));
};

export const unsearchableTermsProcess = async (unsearchableTerms) => {
  const shallowTerms = [...unsearchableTerms];
  const chunks = [];
  let dispatchedProcesses = 0;
  while (dispatchedProcesses < shallowTerms.length) {
    const chunk = createChunk(shallowTerms, SEARCH_EXECUTION_RPS);
    chunks.push(collectAll(chunk));
    dispatchedProcesses += chunks.length;
    await delay(1000);
  }
  await Promise.allSettled(chunks);
};
