import { HTTP_STATUS_CODE_POINTS } from "../../constants/general.js";
import { collectError } from "../collect.js";

export const doRequest = async (
  param,
  executor,
  matchStatus,
  matchBodyCallable = undefined,
) => {
  let status = "unknown";
  let body = null;
  const needsMatchBody = matchBodyCallable !== undefined;
  try {
    const response = await executor(param);
    status = response.status;
    body = await response.json();
  } catch (error) {
    if (error.cause.code) {
      status = error.cause.code;
    }
    collectError({
      error,
      status,
      expectedStatus: matchStatus,
      needsMatchBody,
    });
  }
  const strStatus = String(status);
  return {
    points:
      strStatus in HTTP_STATUS_CODE_POINTS
        ? HTTP_STATUS_CODE_POINTS[strStatus]
        : HTTP_STATUS_CODE_POINTS.unknown,
    matchStatus: status === matchStatus,
    matchBody: !needsMatchBody
      ? true
      : matchBodyCallable && matchBodyCallable(body),
    needsMatchBody,
    responseStatus: status,
    expectedStatus: matchStatus,
    responseBody: body,
    requestBody: param,
  };
};
