export function formatCpfCnpj(value: string) {
  let v = value.replace(/\D/g, "");
  if (v.length > 14) v = v.slice(0, 14);

  if (v.length <= 11) {
    if (v.length > 3) v = v.replace(/^(\d{3})(\d)/, "$1.$2");
    if (v.length > 6) v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (v.length > 9)
      v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return v;
  }

  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  if (v.length > 5) v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  if (v.length > 8)
    v = v.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
  if (v.length > 12)
    v = v.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
  return v;
}

export function formatCnpj(value: string) {
  let v = value.replace(/\D/g, "");

  if (v.length > 14) v = v.slice(0, 14);

  if (v.length < 14) {
    return v;
  }

  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  if (v.length > 5) v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  if (v.length > 8)
    v = v.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
  if (v.length > 12)
    v = v.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");

  return v;
}

export function detectCpfOrCnpj(value: string): "CPF" | "CNPJ" {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) return "CPF";
  if (digits.length === 14) return "CNPJ";
  return "CPF";
}
