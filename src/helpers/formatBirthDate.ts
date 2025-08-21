export function formatBirthDate(value: string) {
  let v = value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);

  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");

  if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

  return v;
}
