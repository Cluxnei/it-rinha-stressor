import { faker } from "@faker-js/faker";
import {
  BAD_PEOPLE_COUNT,
  NAME_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  STACK_MAX_LENGTH,
  STACK_MAX_WORD_LENGTH,
  UNPROCESSABLE_PEOPLE_COUNT,
  VALID_PEOPLE_COUNT,
} from "../constants/general.js";
import { safeNickname } from "./unique.js";

export const validPeopleFactory = (useUniqueNicknames = true) => {
  const hasStack = faker.datatype.boolean();
  let stack = null;
  const stackCount = faker.number.int({ min: 1, max: STACK_MAX_LENGTH });
  if (hasStack) {
    stack = faker.word
      .words({
        count: stackCount,
      })
      .split(" ")
      .map((word) => word.substring(0, STACK_MAX_WORD_LENGTH));
  }
  return {
    apelido: (useUniqueNicknames
      ? safeNickname()
      : faker.person.firstName()
    ).substring(0, NICKNAME_MAX_LENGTH),
    nome: faker.person.fullName().substring(0, NAME_MAX_LENGTH),
    nascimento: faker.date.anytime().toISOString().split("T").shift(),
    stack,
  };
};

const unrefPeople = (peopleRef) => ({
  ...peopleRef,
  stack: peopleRef.stack ? [...peopleRef.stack] : peopleRef.stack,
});

const removePropsFromPeople = (peopleRef) => {
  const people = unrefPeople(peopleRef);
  const remove = {
    apelido: faker.datatype.boolean(),
    nome: faker.datatype.boolean(),
    nascimento: faker.datatype.boolean(),
    stack: faker.datatype.boolean(),
  };
  let removed = false;
  for (const key of Object.keys(remove)) {
    if (!remove[key]) {
      continue;
    }
    removed = true;
    delete people[key];
  }
  if (!removed) {
    delete people.nome;
  }
  return people;
};

const nullablePropsFromPeople = (peopleRef) => {
  const people = unrefPeople(peopleRef);
  const nullables = {
    apelido: faker.datatype.boolean(),
    nome: faker.datatype.boolean(),
    nascimento: faker.datatype.boolean(),
  };
  let nullable = false;
  for (const key in nullables) {
    if (!nullables[key]) {
      continue;
    }
    nullable = true;
    people[key] = null;
  }
  if (!nullable) {
    people.nome = null;
  }
  return people;
};

const changePropsTypesFromPeople = (peopleRef) => {
  const people = unrefPeople(peopleRef);
  const randomType = () => faker.helpers.arrayElement([1, true, "", -2023]);
  const change = {
    apelido: faker.datatype.boolean(),
    nome: faker.datatype.boolean(),
    nascimento: faker.datatype.boolean(),
    stack: faker.datatype.boolean(),
  };
  let changed = false;
  for (const key of Object.keys(change)) {
    if (!changed[key] || !(key in people)) {
      continue;
    }
    changed = true;
    if (key === "stack") {
      people[key] = [
        null,
        2012,
        "fim do mundo?",
        -2014,
        undefined,
        false,
        "testando",
      ];
      continue;
    }
    people[key] = randomType();
  }
  if (!changed) {
    const key = Object.keys(people).shift();
    people[key] = randomType();
  }
  return people;
};

export const badPeopleFactory = (peopleRef) => {
  return removePropsFromPeople(changePropsTypesFromPeople(peopleRef));
};

export const unprocessablePeopleFactory = (peopleRef) => {
  return nullablePropsFromPeople(peopleRef);
};

export const createValidMockData = (callback) => {
  const label = `creating ${VALID_PEOPLE_COUNT} valid people mock data`;
  console.time(label);
  const validPeoplesMockData = new Array(VALID_PEOPLE_COUNT)
    .fill(0)
    .map(() => validPeopleFactory(true));
  console.timeEnd(label);
  callback && callback();
  return validPeoplesMockData;
};

export const createBadMockData = () => {
  const label = `creating ${BAD_PEOPLE_COUNT} bad people mock data`;
  console.time(label);
  const invalidPeoplesMockData = new Array(BAD_PEOPLE_COUNT)
    .fill(0)
    .map(() => badPeopleFactory(validPeopleFactory(false)));
  console.timeEnd(label);
  return invalidPeoplesMockData;
};

export const createUnprocessableMockData = () => {
  const label = `creating ${UNPROCESSABLE_PEOPLE_COUNT} unprocessable people mock data`;
  console.time(label);
  const invalidPeoplesMockData = new Array(UNPROCESSABLE_PEOPLE_COUNT)
    .fill(0)
    .map(() => unprocessablePeopleFactory(validPeopleFactory(false)));
  console.timeEnd(label);
  return invalidPeoplesMockData;
};
