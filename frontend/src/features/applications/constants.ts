export const STATUSES = [
  "Draft",
  "Applied",
  "HR Screen",
  "Interview 1",
  "Interview 2+",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export type Status = (typeof STATUSES)[number];