import { api } from "../apiClient";

export const itemsApi = {
  getAll: () => api.get("/items"),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post("/items", data),
  changeName: (id, itemName) => api.patch(`/items/${id}/name`, { itemName }),
  changeDescription: (id, itemDescription) =>
    api.patch(`/items/${id}/description`, { itemDescription }),
  changeStatus: (id, itemStatus) => api.patch(`/items/${id}/status`, { itemStatus }),
  changeType: (id, itemType) => api.patch(`/items/${id}/type`, { itemType }),
  changeHealth: (id, itemHealth) => api.patch(`/items/${id}/health`, { itemHealth }),
  getHealthHistory: (id) => api.get(`/items/${id}/health-history`),
  remove: (id) => api.delete(`/items/${id}`),
};
