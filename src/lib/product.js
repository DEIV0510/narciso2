// Nombres de un producto. Cada fragancia tiene su nombre comercial Narciso
// (`name`, del catálogo Cantabria del cliente) y la referencia del perfume
// original en el que se inspira (`title` + `brand`). Si algún día falta el
// nombre comercial, se muestra el título del original.
export const displayName = (p) => p.name || p.title

// "1 Million de Paco Rabanne"
export const reference = (p) => `${p.title} de ${p.brand}`

// Texto completo para mensajes y lectores de pantalla:
// "Millón Exclusivo (inspirado en 1 Million de Paco Rabanne)"
export const longName = (p) => (p.name ? `${p.name} (inspirado en ${reference(p)})` : `${p.title} (inspiración ${p.brand})`)

// Línea "Inspirado en…": con nombre comercial cita el perfume completo; sin él,
// el título ya es el del original y basta con la casa (evita repetirlo).
export const inspiredBy = (p) => (p.name ? `Inspirado en ${reference(p)}` : `Inspirado en ${p.brand}`)
