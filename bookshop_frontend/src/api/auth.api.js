import { instance } from ".";
const BASE_URL = "/auth";

export const register = async (body) => {
  const response = await instance.post(`${BASE_URL}/register`, body);

  return response;
};

export const login = async (body) => {
  const response = await instance.post(`${BASE_URL}/login`, body);

  return response;
};

export const reAuth = async (body) => {
  const response = await instance.post(`${BASE_URL}/reauth`, body);

  return response;
};

export const changePassword = async (body) => {
  const response = await instance.post(`${BASE_URL}/change-password`, body);

  return response;
};

export const forgotPassword = async (body) => {
  const response = await instance.post(`${BASE_URL}/forgot-password`, body);
  return response;
};

export const resetPassword = async (body) => {
  const response = await instance.post(
    `${BASE_URL}/change-password-on-confirm`,
    body
  );

  return response;
};
