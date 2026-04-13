import api from "./api";

export const getTasks = (page = 1, limit = 5) => api.get("/tasks", { params: { page, limit } });
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTaskDoneCount = () => api.get("/tasks/done");
export const getTaskPendingCount = () => api.get("/tasks/pending");