import { api } from "../apiClient";

export const reportsApi = {
  generate: () => api.post("/reports/stock"),
  getAll: () => api.get("/reports/stock"),
  getById: (id) => api.get(`/reports/stock/${id}`),
};
