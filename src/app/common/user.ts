export interface CreateUserModel {
  username: string;
  email: string;
  password: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export const validateUsername = (username: string): boolean => {
  return username.length > 0;
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return regex.test(password) && password.length >= minLength;
};
