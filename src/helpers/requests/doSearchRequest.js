export const doSearchRequest = async (term) => {
  const url = `http://localhost:3000/pessoas?t=${term}`;
  return fetch(url);
};
