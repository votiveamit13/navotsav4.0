// src/services/authService.js
import { callApi } from "../utils/api";

export const login = (payload) => {
  return callApi("post", "/auth/login", payload);
};

export const signup = (payload) => {
  return callApi("post", "/auth/signup", payload);
};

export const socialLogin = (payload) => {
  return callApi('post', '/auth/social-login', payload);
}

export const logout = () => {
  return callApi("post", "/auth/logout");
};

export const authMe = () => {
  return callApi("get", "/auth/me");
};

export const updateProfile = (payload) => {
  return callApi('post', "auth/profile", payload);
}



