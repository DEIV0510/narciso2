// Logo oficial de Narciso Parfum (source-material/logo-oficial.png).
// `tone="dark"` = fondo oscuro: misma pieza con el relleno de la palabra en
// marfil (el negro original desaparecería); emblema y bisel dorados intactos.
export default function Logo({ tone = 'dark', className = '', eager = false, height = 56 }) {
  const name = tone === 'dark' ? 'logo-reverse' : 'logo'
  const width = Math.round((height * 414) / 360)
  return (
    <picture className={className}>
      <source srcSet={`/brand/${name}.webp`} type="image/webp" />
      <img
        src={`/brand/${name}.png`}
        alt="Narciso Parfum"
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

export function Emblem({ className = '', size = 40 }) {
  return (
    <picture className={className}>
      <source srcSet="/brand/emblem.webp" type="image/webp" />
      <img src="/brand/emblem.png" alt="" width={Math.round((size * 278) / 240)} height={size} loading="lazy" decoding="async" />
    </picture>
  )
}
