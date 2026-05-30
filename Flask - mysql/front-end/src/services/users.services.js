import api from "./api";

export const getUsers = (page = 1, limit = 20) => {
  const params = { page, limit };
  return api.get("/users", { params });
}

export const createUser = (userData) => {
  return api.post("/users", userData);
}   

export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
}

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
}   