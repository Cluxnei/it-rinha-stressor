import { faker } from "@faker-js/faker";

let globalCounter = 1;

let generatedNickNames = new Set([]);

export const safeNickname = (currentIterations = 0) => {
  const name = faker.person.fullName();
  if (currentIterations >= 10) {
    return name + " " + globalCounter++;
  }
  if (generatedNickNames.has(name)) {
    return safeNickname(currentIterations + 1);
  }
  generatedNickNames.add(name);
  return name;
};

export const resetGeneratedNicknames = () => {
  generatedNickNames = new Set([]);
  globalCounter = 1;
};
