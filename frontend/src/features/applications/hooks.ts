import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchApplications,
  createApplication,
  changeApplicationStatus,
  deleteApplication,
  fetchApplicationDetail,
} from "./api";
import type { CreateApplicationInput, ChangeStatusInput } from "./types";

const QK = {
  applications: ["applications"] as const,
};

export function useApplications() {
  return useQuery({
    queryKey: QK.applications,
    queryFn: fetchApplications,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.applications }),
  });
}

export function useChangeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { appId: number; input: ChangeStatusInput }) =>
      changeApplicationStatus(args.appId, args.input),
    // v1 简单直接：成功后重新拉列表
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.applications }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: number) => deleteApplication(appId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.applications }),
  });
}

export function useApplicationDetail(appId: number | null) {
  return useQuery({
    queryKey: ["application", appId],
    queryFn: () => fetchApplicationDetail(appId as number),
    enabled: !!appId,
  });
}