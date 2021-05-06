const token = window.localStorage.getItem("token");

export default {
  message: {},
  auth: { isLoggedIn: !!token, token, me: {} },
  projects: []
};
