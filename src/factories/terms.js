import { faker } from "@faker-js/faker";
import { UNSEARCHABLE_TERMS_COUNT } from "../constants/general.js";

export const createSearchableTerms = (validPeople) => {
  const label = `creating searchable terms mock data`;
  console.time(label);
  const terms = [];
  for (const people of validPeople) {
    let picked = false;
    if (faker.datatype.boolean()) {
      terms.push(people.nome);
      picked = true;
    }
    if (faker.datatype.boolean()) {
      terms.push(people.apelido);
      picked = true;
    }
    if (people.stack && people.stack.length && faker.datatype.boolean()) {
      const stackCount = faker.number.int({
        min: 1,
        max: people.stack.length,
      });
      for (let i = 0; i < stackCount; i++) {
        terms.push(faker.helpers.arrayElement(people.stack));
      }
      picked = true;
    }
    if (!picked) {
      terms.push(people.nome);
    }
  }
  console.timeLog(label, `created ${terms.length} terms`);
  console.timeEnd(label);
  return terms;
};

const generateSafeWord = (exceptions) => {
  let maxIterations = 20;
  let i = 0;
  while (i < maxIterations) {
    let word = faker.word.words();
    if (!exceptions.has(word)) {
      return word;
    }
    i++;
  }
  return Math.random().toString(16).substring(3);
};

export const createUnsearchableTerms = (searchableTerms) => {
  const label = `creating unsearchable terms mock data`;
  console.time(label);
  const terms = [];
  const searchableTermsHashMap = new Set(searchableTerms);
  for (let i = 0; i < UNSEARCHABLE_TERMS_COUNT; i++) {
    terms.push(generateSafeWord(searchableTermsHashMap));
  }
  console.timeLog(label, `created ${terms.length} terms`);
  console.timeEnd(label);
  return terms;
};
