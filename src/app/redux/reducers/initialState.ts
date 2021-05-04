const token = window.localStorage.getItem("token");

export default {
  message: {},
  user: { isLoggedIn: !!token, token }
};
