# Narciso Parfum — boutique digital

Rediseño completo del sitio de **Narciso Parfum** (perfumería de inspiración, Ibagué, Tolima).
Dirección de arte **"Luxury Editorial Nocturne"**: escenas oscuras con luz dorada lateral,
bloques editoriales en marfil, tipografía Bodoni Moda + Manrope y composiciones asimétricas.

Reemplaza al sitio anterior (repositorio `DEIV0510/narciso`, que en septiembre de 2026 se
había rebautizado "Gentleman Co"): vuelve la marca **Narciso Parfum** con su logo oficial y se
conservan todos los datos comerciales reales de ese proyecto.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5274
npm run build     # dist/: compila, prerenderiza las 286 páginas y genera sitemap/robots
npm run preview   # sirve dist/ con las mismas reglas de URL que producción (puerto 5275)
npm run assets    # regenera logo, favicons, Open Graph, hero y fotos de catálogo
```

Stack: React 18 + Vite 5 + React Router 7, CSS propio por componente (sin Tailwind ni
librerías de animación). Sin dependencias en tiempo de ejecución aparte de React y el router.

## Estructura

```
src/
  App.jsx, main.jsx, entry-server.jsx   rutas, hidratación y render para el prerender
  data/
    products.js       catálogo real (283 fragancias, precios y presentaciones) — sin cambios de datos
    fragranceInfo.js  fichas olfativas verificadas (280 de 283) — sin cambios de datos
    site.js           marca, contacto, envíos, pagos, mensajes de WhatsApp
    profiles.js       8 perfiles olfativos calculados desde las fichas + temas visuales
    promotions.js     promociones reales (hoy: 3 fragancias por $130.000)
    featured.js       selección editorial de la portada
  context/CartContext.jsx  carrito (persistido en localStorage, precios validados contra el catálogo)
  lib/  seo.js (metadatos + JSON-LD por ruta), order.js (pedido y proveedores de pago), images.js, format.js
  components/  Header, Footer, ProductCard, CartDrawer, home/* (Hero, Collections, Selection,
               ProfileExplorer, Promotions, House, Visit) …
  pages/       HomePage, CatalogPage (/perfumes), ProductPage (/perfumes/:id), NotFoundPage
scripts/
  build-assets.mjs   recursos optimizados a partir de source-material/
  prerender.mjs      HTML estático por ruta + sitemap.xml + robots.txt
  serve.mjs          servidor local de dist/
public/
  brand/             logo oficial (fondo claro y fondo oscuro), emblema, og-image
  img/perfumes/      <id>.jpg (foto original) + <id>-640/-1100 .avif/.webp
  .htaccess          reglas para hosting Apache (FTP): URLs limpias, 404, caché
vercel.json          equivalente para Vercel
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero cinematográfico, colecciones, selección, perfil olfativo, promociones, la casa, ubicación |
| `/perfumes` | Catálogo con filtros por colección, familia olfativa, búsqueda (nombre, casa o nota) y orden. Los filtros viven en la URL: `/perfumes?genero=mujer&perfil=florales&q=vainilla` |
| `/perfumes/<id>` | Ficha: compra (presentación, cantidad, carrito, WhatsApp, Addi), pirámide olfativa, experiencia y recomendaciones |

Cada ruta se entrega prerenderizada (título, descripción, canonical, Open Graph y JSON-LD
`Product` + `BreadcrumbList` propios), y React la hidrata en el navegador.

## Decisiones de contenido

- **Logo**: `source-material/logo-oficial.png`. En fondos oscuros se usa la misma pieza con el
  relleno negro de la palabra NARCISO llevado a marfil (`logo-reverse`); el emblema y el bisel
  dorado no se tocan. En fondos claros, el original.
- **Fotos**: las 283 fotos de producto son las originales del cliente (no se alteran: solo se
  recodifican a AVIF/WebP). El hero y la promoción usan el recorte real del frasco
  (`botella-oficial.png`) y un desenfoque de la estantería real de esencias.
- **"Inspirado en"**: el sitio nunca sugiere que vende el perfume original. El pie de página lo
  aclara y cada ficha cita la referencia olfativa.
- **Perfiles olfativos**: se calculan con la familia y las ocasiones verificadas de cada ficha
  (`profiles.js`); no hay asignaciones a mano. "Acordes de familia" son las palabras de la familia
  olfativa verificada; "Para quién" se arma solo con ocasión, momento y estación de la ficha.
- **Promoción**: datos tomados de la pieza oficial (`source-material/promo-especial.png`). El
  descuento no se aplica automáticamente en el carrito: el cliente marca que quiere la promoción y
  se confirma por WhatsApp.
- **Pago**: no hay pasarela integrada. El pedido se envía por WhatsApp (transferencia o Addi) y la
  interfaz lo muestra como *pendiente de confirmación y pago*, nunca como pagado. El carrito solo
  se vacía cuando el cliente confirma que envió el mensaje. `lib/order.js` documenta cómo añadir
  una pasarela.

## Pendiente de confirmar con el cliente

Estos datos no existen todavía; el sitio está preparado y no muestra nada inventado:

1. **Tarifa de envío** — `shipping.rate` en `src/data/site.js`. Con un valor, el carrito la suma.
2. **Vigencia de la promoción** — `validUntil` en `src/data/promotions.js` (se muestra y la oculta sola al vencer).
3. **¿La promoción incluye Torino21 y Unstoppable Hong Kong?** (se venden a $60.000, sin talla fija).
4. **Inventario** — no hay sistema de existencias; la disponibilidad se confirma por WhatsApp.
5. **Pasarela de pago** — si se contrata (Wompi, Mercado Pago, Bold…), conectarla en `lib/order.js`.
6. **Fichas olfativas** de Eros Pour Femme, Vega y Arrurrú — sin fuente fiable; sus fichas lo dicen.
7. **Horario de atención** de la tienda en Ibagué (no se publica porque no se conoce).
8. **Dominio** — por defecto `https://narcisoparfum.com` (cambiar con `VITE_SITE_URL` al compilar).
