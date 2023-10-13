import { writeFile } from "node:fs/promises";

export const saveJson = async (name, object) =>
  writeFile(name, JSON.stringify(object, null, 2), {
    encoding: "utf-8",
  });
