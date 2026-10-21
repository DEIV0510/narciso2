export function formatCOP(amount) {
  return `$${Number(amount).toLocaleString('es-CO')}`
}

export function formatCOPLong(amount) {
  return `${formatCOP(amount)} COP`
}
