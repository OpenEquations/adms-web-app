import { api } from "../apiClient";

export const organizationApi = {
  get: () => api.get("/organization"),
  update: (data) => api.put("/organization", data),
};
