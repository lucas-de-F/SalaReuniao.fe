import axios from "axios";
import { jwtService } from "./jwtService";

const api = axios.create({
  baseURL: "http://localhost:5224/api",
});

api.interceptors.request.use((config) => {
  const token = jwtService.getToken();
  if (token) {
    // Use o método correto para setar Authorization
    config.headers = config.headers ?? {};
    if ("set" in config.headers) {
      // se já for AxiosHeaders
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // fallback: objeto simples
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
