import { api } from "@/lib/api";

export const loginUser = (email: string, password: string) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};