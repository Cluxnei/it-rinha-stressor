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

function generateMockData() {
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
  return mockData;
}

async function main() {
  const mockData = generateMockData();
  await pipeAll([
    // validPeopleProcess(mockData.validPeople),
    // invalidPeopleProcess(mockData.badPeople, mockData.unprocessablePeople),
    unsearchableTermsProcess(mockData.unSearchableTerms),
  ]);
  // await pipeAll([searchableTermsProcess(mockData.searchableTerms)]);
  showCollection();
}

console.time("total");
main().then(() => {
  console.log("execution finished");
  console.timeEnd("total");
  process.exit(0);
});
