export function formatToIso(dateStr: string, timeStr = "00:00"): string {
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  const [HH, MI] = timeStr.split(":").map(Number);
  if (!dd || !mm || !yyyy || Number.isNaN(HH) || Number.isNaN(MI))
    return dateStr;

  const d = new Date(Date.UTC(yyyy, mm - 1, dd, HH, MI, 0, 0));
  return d.toISOString();
}
