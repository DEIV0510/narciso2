import { productImage } from '../lib/images'

// Foto original del producto (nunca se altera: solo se sirve en AVIF/WebP en
// el tamaño adecuado, con dimensiones fijas para no mover el diseño).
export default function ProductImage({ product, sizes, eager = false, className = '', alt }) {
  const img = productImage(product.image)
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={img.avif} sizes={sizes} />
      <source type="image/webp" srcSet={img.webp} sizes={sizes} />
      <img
        src={img.jpg}
        alt={alt ?? `${product.title}, fragancia de Narciso Parfum inspirada en ${product.brand}`}
        width="880"
        height="1173"
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}
