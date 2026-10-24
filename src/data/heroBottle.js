// Frasco del hero: el <picture> (Hero.jsx) y su precarga (scripts/prerender.mjs)
// deben usar exactamente las mismas cadenas; si difieren, el navegador elige
// otro candidato y descarga la imagen dos veces.
// sizes = ancho real de .hero__main (Hero.css): hasta 290 px en escritorio y
// unos 140 px en móvil.
export const BOTTLE_SRC = {
  avif: '/img/hero/bottle-760.avif 280w, /img/hero/bottle-1400.avif 515w',
  webp: '/img/hero/bottle-760.webp 280w, /img/hero/bottle-1400.webp 515w',
}
export const BOTTLE_SIZES = '(min-width: 900px) 260px, 140px'
