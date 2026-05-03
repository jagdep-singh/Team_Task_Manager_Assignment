import { api } from "@/lib/api";

export const getProjects = () => {
  return api("/project/");
};

export const getMembers = (projectId: string) => {
  return api(`/project/${projectId}/members`);
};

export const getDashboard = (projectId: string) => {
  return api(`/project/${projectId}/dashboard`);
};