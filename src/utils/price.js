export function toNumber(value) {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const n = Number(value.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function formatBRL(value, { withSymbol = false } = {}) {
  const n = toNumber(value);
  if (n == null) return '—';
  const s = n.toFixed(2).replace('.', ',');
  return withSymbol ? `R$ ${s}` : s;
}