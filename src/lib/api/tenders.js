import { api } from "../apiClient";

export const tendersApi = {
  getAll: () => api.get("/tenders"),
  getById: (id) => api.get(`/tenders/${id}`),
  create: (data) => api.post("/tenders", data),
  getItems: (id) => api.get(`/tenders/${id}/items`),
  addItem: (id, itemId) => api.post(`/tenders/${id}/items`, { itemId }),
  changeTitle: (id, title) => api.patch(`/tenders/${id}/title`, { title }),
  changeDescription: (id, description) =>
    api.patch(`/tenders/${id}/description`, { description }),
  changeStatus: (id, status) => api.patch(`/tenders/${id}/status`, { status }),
  setWinner: (id, companyId) => api.patch(`/tenders/${id}/winner`, { companyId }),
  conclude: (id, companyId) => api.post(`/tenders/${id}/conclude`, { companyId }),
  remove: (id) => api.delete(`/tenders/${id}`),
};
