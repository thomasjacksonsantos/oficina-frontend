export function formatCep(value: string) {
  let v = value?.replace(/\D/g, "");
  if (v.length > 8) v = v?.slice(0, 8);
  if (v.length > 5) v = v?.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
  return v;
}
