import {
  createBadMockData,
  createUnprocessableMockData,
  createValidMockData,
} from "./factories/people.js";
import { resetGeneratedNicknames } from "./factories/unique.js";
import {
  createSearchableTerms,
  createUnsearchableTerms,
} from "./factories/terms.js";
import { pipeAll } from "./helpers/pipe.js";
import { unsearchableTermsProcess } from "./helpers/process/unserachable.js";
import { showCollection } from "./helpers/collect.js";
import {
  endMeasure,
  setMeasureFixedData,
  startMeasure,
} from "./helpers/measure.js";
import { invalidPeopleProcess } from "./helpers/process/invalidPeople.js";

function generateMockData() {
  const label = "generating mock data";
  console.time(label);
  const mockData = {
    validPeople: createValidMockData(() => {
      resetGeneratedNicknames();
    }),
    badPeople: createBadMockData(),
    unprocessablePeople: createUnprocessableMockData(),
  };
  mockData.searchableTerms = createSearchableTerms(mockData.validPeople);
  mockData.unSearchableTerms = createUnsearchableTerms(
    mockData.searchableTerms,
  );
  console.timeEnd(label);
  const mockMetadata = Object.keys(mockData).reduce(
    (acc, key) => ({
      ...acc,
      [key]: mockData[key].length,
    }),
    {},
  );
  setMeasureFixedData(mockMetadata);
  return mockData;
}

async function main() {
  const mockData = generateMockData();
  startMeasure();
  await pipeAll([
    // validPeopleProcess(mockData.validPeople),
    invalidPeopleProcess(mockData.badPeople, mockData.unprocessablePeople),
    unsearchableTermsProcess(mockData.unSearchableTerms),
  ]);
  // await pipeAll([searchableTermsProcess(mockData.searchableTerms)]);
  endMeasure();
  showCollection();
}

console.time("total");
main().then(() => {
  console.log("execution finished");
  console.timeEnd("total");
  process.exit(0);
});
