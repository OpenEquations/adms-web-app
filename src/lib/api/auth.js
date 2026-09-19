import { api } from "../apiClient";

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
};
