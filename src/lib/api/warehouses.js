import { api } from "../apiClient";

export const warehousesApi = {
  getAll: () => api.get("/warehouses"),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (name) => api.post("/warehouses", { name }),
  changeName: (id, name) => api.patch(`/warehouses/${id}/name`, { name }),
  remove: (id) => api.delete(`/warehouses/${id}`),
  getItems: (id) => api.get(`/warehouses/${id}/items`),
  addItem: (id, itemId) => api.post(`/warehouses/${id}/items`, { itemId }),
  removeItem: (id, itemId) => api.delete(`/warehouses/${id}/items/${itemId}`),
};
