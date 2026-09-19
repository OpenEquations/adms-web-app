import { api } from "../apiClient";

export const companiesApi = {
  getAll: () => api.get("/companies"),
  getById: (id) => api.get(`/companies/${id}`),
  create: (name, email) => api.post("/companies", { name, email }),
  changeName: (id, name) => api.patch(`/companies/${id}/name`, { name }),
  changeEmail: (id, email) => api.patch(`/companies/${id}/email`, { email }),
  remove: (id) => api.delete(`/companies/${id}`),
};
