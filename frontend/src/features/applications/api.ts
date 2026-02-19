import { api } from "../../lib/api";
import type { Application, CreateApplicationInput, ChangeStatusInput } from "./types";

export async function fetchApplications() {
  const res = await api.get<Application[]>("/applications");
  return res.data;
}

export async function createApplication(input: CreateApplicationInput) {
  const res = await api.post<Application>("/applications", input);
  return res.data;
}

export async function changeApplicationStatus(appId: number, input: ChangeStatusInput) {
  const res = await api.post<Application>(`/applications/${appId}/status`, input);
  return res.data;
}

export async function deleteApplication(appId: number) {
  const res = await api.delete(`/applications/${appId}`);
  return res.data;
}

export async function fetchApplicationDetail(appId: number) {
  const res = await api.get(`/applications/${appId}`);
  return res.data as import("./types").Application & {
    status_logs: Array<{
      id: number;
      from_status?: string | null;
      to_status: string;
      note?: string | null;
      created_at: string;
    }>;
  };
}