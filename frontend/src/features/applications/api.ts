import { api } from "../../lib/api";
import type { Application, CreateApplicationInput, ChangeStatusInput } from "./types";
import type { Status } from "./constants";
import type { SortKey } from "./components/FilterBar";

export type ApplicationsPage = {
  items: Application[];
  page: number;
  page_size: number;
  total: number;
};

export async function fetchApplications(params: {
  q?: string;
  status?: string; // "All" means omit
  sort?: SortKey;
  page?: number;
  page_size?: number;
}) {
  const { q, status, sort, page = 1, page_size = 50 } = params;

  const res = await api.get<ApplicationsPage>("/applications", {
    params: {
      q: q?.trim() || undefined,
      status: status && status !== "All" ? status : undefined,
      sort,
      page,
      page_size,
    },
  });

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

export async function updateApplication(
  appId: number,
  input: Partial<import("./types").CreateApplicationInput>
) {
  const res = await api.patch(`/applications/${appId}`, input);
  return res.data as import("./types").Application;
}

