const API = process.env.NEXT_PUBLIC_API_URL;

export const request = async (
  endpoint: string,
  method: string = "GET",
  body?: unknown
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};