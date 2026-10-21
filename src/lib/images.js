// Fotos de producto en public/img/perfumes (generadas por scripts/build-assets.mjs):
//   <id>-640.{avif,webp}   tarjetas
//   <id>-1100.{avif,webp}  ficha
//   <id>.jpg               respaldo y Open Graph
// Todos los productos tienen foto propia; si algún día falta, `image` vale
// 'catalog-bottle' y se usa el frasco Narciso recortado.
export function productImage(imageId) {
  if (!imageId || imageId === 'catalog-bottle') {
    return {
      avif: '/img/hero/bottle-760.avif 280w, /img/hero/bottle-1400.avif 515w',
      webp: '/img/hero/bottle-760.webp 280w, /img/hero/bottle-1400.webp 515w',
      jpg: '/img/hero/bottle-760.webp',
      og: '/brand/og-image.jpg',
      cutout: true,
    }
  }
  const base = `/img/perfumes/${imageId}`
  return {
    avif: `${base}-640.avif 640w, ${base}-1100.avif 1100w`,
    webp: `${base}-640.webp 640w, ${base}-1100.webp 1100w`,
    jpg: `${base}.jpg`,
    og: `${base}.jpg`,
    cutout: false,
  }
}
