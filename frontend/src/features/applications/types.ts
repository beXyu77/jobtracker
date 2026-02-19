import type { Status } from "./constants";

export type Application = {
  id: number;
  company: string;
  position: string;
  location?: string | null;
  platform?: string | null;
  url?: string | null;
  status: Status;
  applied_at?: string | null; // backend returns ISO date string
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateApplicationInput = {
  company: string;
  position: string;
  location?: string | null;
  platform?: string | null;
  url?: string | null;
  status?: Status;
  applied_at?: string | null;
  notes?: string | null;
};

export type ChangeStatusInput = {
  to_status: Status;
  note?: string | null;
};