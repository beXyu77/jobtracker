export function toIntId(id: string | number) {
  return typeof id === "string" ? Number(id) : id;
}