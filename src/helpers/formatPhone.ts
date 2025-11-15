export function formatPhone(value: string) {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length <= 10) {
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    if (v.length > 6) v = v.replace(/^(\(\d{2}\)\s\d{4})(\d)/, "$1-$2");
  } else {
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    if (v.length > 7) v = v.replace(/^(\(\d{2}\)\s\d{5})(\d)/, "$1-$2");
  }
  return v;
}
