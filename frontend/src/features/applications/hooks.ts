import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchApplications,
  createApplication,
  changeApplicationStatus,
  deleteApplication,
  fetchApplicationDetail,
  updateApplication,
  fetchKpi, 
  fetchStatusCounts, 
  fetchAppliedDaily,
} from "./api";
import type { CreateApplicationInput, ChangeStatusInput } from "./types";
import type { SortKey } from "./components/FilterBar";

const QK = {
  applications: ["applications"] as const,
};

export function useApplications(params: {
  q: string;
  status: string;
  sort: SortKey;
  page: number;
  page_size: number;
}) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => fetchApplications(params),
    keepPreviousData: true,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.applications });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useChangeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { appId: number; input: ChangeStatusInput }) =>
      changeApplicationStatus(args.appId, args.input),
    // v1 简单直接：成功后重新拉列表
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.applications });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: number) => deleteApplication(appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.applications });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useApplicationDetail(appId: number | null) {
  return useQuery({
    queryKey: ["application", appId],
    queryFn: () => fetchApplicationDetail(appId as number),
    enabled: !!appId,
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { appId: number; input: any }) =>
      updateApplication(args.appId, args.input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["application", vars.appId] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useKpi() {
  return useQuery({
    queryKey: ["stats", "kpi"],
    queryFn: fetchKpi,
  });
}

export function useStatusCounts() {
  return useQuery({
    queryKey: ["stats", "status"],
    queryFn: fetchStatusCounts,
  });
}

export function useAppliedDaily(days = 30) {
  return useQuery({
    queryKey: ["stats", "applied_daily", days],
    queryFn: () => fetchAppliedDaily(days),
  });
}