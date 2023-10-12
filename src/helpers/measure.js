const requestDispatchPerSecond = {};
const requestResponsePerSecond = {};
const measureFixedData = [];

let elapsedSeconds = 0;
let measureIntervalId = null;
let totalRequestDispatch = 0;
let totalRequestResponse = 0;

export const setMeasureFixedData = (data) => {
  for (const key in data) {
    measureFixedData.push({ "general data": key, count: data[key] });
  }
};

export const measureRequestDispatch = () => {
  if (!(elapsedSeconds in requestDispatchPerSecond)) {
    requestDispatchPerSecond[elapsedSeconds] = 0;
  }
  requestDispatchPerSecond[elapsedSeconds] += 1;
  totalRequestDispatch += 1;
};

export const measureRequestResponse = () => {
  if (!(elapsedSeconds in requestResponsePerSecond)) {
    requestResponsePerSecond[elapsedSeconds] = 0;
  }
  requestResponsePerSecond[elapsedSeconds] += 1;
  totalRequestResponse += 1;
};

const measureLog = () => {
  console.clear();
  console.table(measureFixedData, ["general data", "count"]);
  console.table(
    [
      { "current second metric": "elapsed seconds", value: elapsedSeconds },
      {
        "current second metric": "requests dispatch",
        value: requestDispatchPerSecond[elapsedSeconds],
      },
      {
        "current second metric": "responses",
        value: requestResponsePerSecond[elapsedSeconds],
      },
      {
        "current second metric": "waiting response",
        value: Math.max(
          0,
          requestDispatchPerSecond[elapsedSeconds] -
            requestResponsePerSecond[elapsedSeconds],
        ),
      },
    ],
    ["current second metric", "value"],
  );
  console.table(
    [
      {
        metric: "average requests dispatch per second",
        value: Number((totalRequestDispatch / elapsedSeconds).toFixed(2)),
      },
      {
        metric: "average responses per second",
        value: Number((totalRequestResponse / elapsedSeconds).toFixed(2)),
      },
      {
        metric: "waiting response",
        value: Math.max(0, totalRequestDispatch - totalRequestResponse),
      },
    ],
    ["metric", "value"],
  );
};

export const startMeasure = () => {
  console.log("starting measureRequestDispatch pipeline...");
  measureIntervalId = setInterval(() => {
    measureLog();
    elapsedSeconds += 1;
  }, 1000);
};

export const endMeasure = () => {
  measureIntervalId && clearInterval(measureIntervalId);
  console.log("finishing measureRequestDispatch pipeline...");
};
