import {
  BAD_PEOPLE_EXECUTION_RPS,
  UNPROCESSABLE_PEOPLE_EXECUTION_RPS,
} from "../../constants/general.js";
import { delay } from "../delay.js";
import { collectAll } from "../collect.js";
import { createChunk } from "../chunk.js";
import { doCreatePeopleRequest } from "../requests/doCreatePeopleRequest.js";
import { doRequest } from "../requests/doRequest.js";

const doBadPeopleRequest = async (people) => {
  return doRequest(people, doCreatePeopleRequest, 400);
};

const doUnprocessablePeopleRequest = async (people) => {
  return doRequest(people, doCreatePeopleRequest, 422);
};

export const invalidPeopleProcess = async (badPeople, unProcessablePeople) => {
  const shallowBad = [...badPeople];
  const shallowUnprocessable = [...unProcessablePeople];
  const chunks = [];
  let dispatchedProcesses = 0;
  while (
    dispatchedProcesses <
    shallowBad.length + shallowUnprocessable.length
  ) {
    const chunk = [
      ...createChunk(shallowBad, BAD_PEOPLE_EXECUTION_RPS, doBadPeopleRequest),
      ...createChunk(
        shallowUnprocessable,
        UNPROCESSABLE_PEOPLE_EXECUTION_RPS,
        doUnprocessablePeopleRequest,
      ),
    ];
    chunks.push(collectAll(chunk));
    dispatchedProcesses += chunk.length;
    await delay(1000);
  }
  await Promise.allSettled(chunks);
};
