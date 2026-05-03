import { api } from "@/lib/api";

export const getTasks = (projectId: string) => {
  return api(`/project/${projectId}/tasks`);
};

export const updateTaskStatus = (projectId: string, taskId: number, status: string) => {
  return api(`/project/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const createTask = (projectId: string, data: any) => {
  return api(`/project/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};