export const doCreatePeopleRequest = async (people) => {
  const url = `http://localhost:3000/pessoas`;
  return fetch(url, {
    method: "post",
    body: JSON.stringify(people),
    headers: { "Content-Type": "application/json" },
  });
};
