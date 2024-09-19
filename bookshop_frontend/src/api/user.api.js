import { instance } from ".";

const baseURL = "/user";

export const getUsers = async (body) => {
  const response = await instance.post(`${baseURL}/get-users`, body);
  return response;
};

export const getUserById = async (user) => {
  const response = await instance.get(`${baseURL}/${user._id}`);
  return response;
};

export const createUser = async (user) => {
  const response = await instance.post(`${baseURL}`, user);
  return response;
};

export const updateUser = async (user) => {
  const response = await instance.put(`${baseURL}/update/${user._id}`, user);
  return response;
};

export const deleteUser = async (user) => {
  const response = await instance.put(`${baseURL}/delete/${user._id}`);
  return response;
};

export const changeActiveStatus = (user) => {
  return instance.put(`${baseURL}/update-status/${user._id}`, user);
};
