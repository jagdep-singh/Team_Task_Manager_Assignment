const API = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* GET TASKS */
export const getTasks = async (projectId: string) => {
  const res = await fetch(`${API}/project/${projectId}/tasks`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

/* CREATE TASK */
export const createTask = async (projectId: string, data: any) => {
  const res = await fetch(`${API}/project/${projectId}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const moveTask = async (
  projectId: string | number,
  taskId: number,
  status: string
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  // 🔥 HANDLE 403 CLEANLY
  if (res.status === 403) {
    return { error: "NOT_ALLOWED" };
  }

  if (!res.ok) {
    return { error: "FAILED" };
  }

  return res.json();
};

/* UPDATE TASK (PRIORITY ETC) */
export const updateTask = async (
  projectId: string,
  taskId: number,
  data: any
) => {
  const res = await fetch(
    `${API}/project/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  return res.json();
};