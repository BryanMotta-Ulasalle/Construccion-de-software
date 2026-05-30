import api from "./api";

export const getTasks = (page = 1, limit = 5, query = "") => {
  const params = { page, limit };
  if (query) params.query = query;
  return api.get("/tasks", { params });
};
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTaskDoneCount = () => api.get("/tasks/done");
export const getTaskPendingCount = () => api.get("/tasks/pending");




