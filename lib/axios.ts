import axios from "axios";
import { env } from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
