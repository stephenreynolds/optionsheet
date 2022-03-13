export const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  if (token) {
    return { "x-access-token": token };
  }

  return {};
};