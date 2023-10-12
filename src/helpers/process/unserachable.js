import {
  HTTP_STATUS_CODE_POINTS,
  UNSEARCHABLE_EXECUTION_RPS,
} from "../../constants/general.js";
import { delay } from "../delay.js";
import { collectAll } from "../collect.js";
import { doSearchRequest } from "../requests/doSearchRequest.js";
import { createChunk } from "../chunk.js";
import { doRequest } from "../requests/doRequest.js";

const doUnsearchableRequest = async (term) => {
  return doRequest(
    term,
    doSearchRequest,
    200,
    (body) => body && Array.isArray(body) && body.length === 0,
  );
};

export const unsearchableTermsProcess = async (unsearchableTerms) => {
  const shallowTerms = [...unsearchableTerms];
  const chunks = [];
  let dispatchedProcesses = 0;
  while (dispatchedProcesses < shallowTerms.length) {
    const chunk = createChunk(
      shallowTerms,
      UNSEARCHABLE_EXECUTION_RPS,
      doUnsearchableRequest,
    );
    chunks.push(collectAll(chunk));
    dispatchedProcesses += chunk.length;
    await delay(1000);
  }
  await Promise.allSettled(chunks);
};
