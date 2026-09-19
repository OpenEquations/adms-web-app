import { api } from "../apiClient";

export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  changeName: (id, firstName, lastName) =>
    api.patch(`/users/${id}/name`, { firstName, lastName }),
  changeEmail: (id, email) => api.patch(`/users/${id}/email`, { email }),
  changePassword: (id, password) => api.patch(`/users/${id}/password`, { password }),
  remove: (id) => api.delete(`/users/${id}`),
};
