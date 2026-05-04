const API = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getProjects = async () => {
  const res = await fetch(`${API}/project/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) return [];

  return res.json();
};

export const createProject = async (data: any) => {
  const res = await fetch(`${API}/project/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getMembers = async (projectId: string | number) => {
  const res = await fetch(`${API}/project/${projectId}/members`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const addMember = async (projectId: string | number, email: string) => {
  const res = await fetch(`${API}/project/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ email }),
  });

  return res.json();
};

export const getProjectDashboard = async (projectId: string | number) => {
  const res = await fetch(`${API}/project/${projectId}/dashboard`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};