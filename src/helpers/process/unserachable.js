import {
  HTTP_STATUS_CODE_POINTS,
  SEARCH_EXECUTION_CHUNKS_COUNT,
  SEARCH_EXECUTION_DELAY_RANGE,
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
  const processPerChunk = Math.ceil(
    shallowTerms.length / SEARCH_EXECUTION_CHUNKS_COUNT,
  );

  for (let i = 0; i < SEARCH_EXECUTION_CHUNKS_COUNT; i++) {
    const chunk = createChunk(shallowTerms, processPerChunk);
    await collectAll(chunk);
    const ms = faker.number.int({
      min: SEARCH_EXECUTION_DELAY_RANGE[0],
      max: SEARCH_EXECUTION_DELAY_RANGE[1],
    });
    await delay(ms);
  }
};
