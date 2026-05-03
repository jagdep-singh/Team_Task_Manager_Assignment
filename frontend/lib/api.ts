const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = async (url: string, options: any = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  return res.json();
};