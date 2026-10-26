# Narciso Parfum — boutique digital

Rediseño completo del sitio de **Narciso Parfum** (perfumería de inspiración, Ibagué, Tolima).
Dirección de arte **"Luxury Editorial Nocturne"**: escenas oscuras con luz dorada lateral,
bloques editoriales en marfil, tipografía Bodoni Moda + Manrope y composiciones asimétricas.

Reemplaza al sitio anterior (repositorio `DEIV0510/narciso`, que en septiembre de 2026 se
había rebautizado "Gentleman Co"): vuelve la marca **Narciso Parfum** con su logo oficial y se
conservan todos los datos comerciales reales de ese proyecto.

**En línea en https://narcisoparfum.com** desde el 2026-10-24 (ver "Publicación").

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5274
npm run build     # dist/: compila, prerenderiza las 266 páginas y genera sitemap/robots
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
    catalog.js        catálogo exacto del cliente (266 fragancias, orden y sección del Excel)
    products.js       arma cada producto: presentaciones 50/100 ml y precios
    fragranceInfo.js  fichas olfativas verificadas (+ fragranceInfoNuevas.js para las 5 nuevas)
    site.js           marca, contacto, envíos, pagos, mensajes de WhatsApp
    profiles.js       8 perfiles olfativos calculados desde las fichas + temas visuales
    promotions.js     promociones reales (hoy ninguna activa)
    featured.js       selección editorial de la portada
  context/CartContext.jsx  carrito (persistido en localStorage, precios validados contra el catálogo)
  lib/  seo.js (metadatos + JSON-LD por ruta), order.js (pedido y proveedores de pago), images.js, format.js
  components/  Header, Footer, ProductCard, CartDrawer, home/* (Hero, Collections, Selection,
               ProfileExplorer, Promotions, House, Visit) …
  pages/       HomePage, CatalogPage (/perfumes), ProductPage (/perfumes/:id), NotFoundPage
scripts/
  build-assets.mjs   recursos optimizados a partir de source-material/
  prerender.mjs      HTML estático por ruta + sitemap.xml + robots.txt
  verify.mjs         verificación automática al final del build (datos, enlaces, SEO)
  serve.mjs          servidor local de dist/ con las mismas reglas que .htaccess
public/
  brand/             logo oficial (fondo claro y fondo oscuro), emblema, og-image
  img/perfumes/      <id>.jpg (foto original) + <id>-640/-1100 .avif/.webp
  .htaccess          reglas para hosting Apache (FTP): URLs limpias, 404, caché, www → sin www
  assets/.htaccess   caché de un año solo para lo que lleva hash (lo genera Vite en /assets)
vercel.json          equivalente para Vercel
docs/revision-catalogo.md  revisión del Excel del cliente: aplicado, dudas y nombres comerciales
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero cinematográfico, colecciones, selección, perfil olfativo, presentaciones y Addi (o la promoción activa), la casa, ubicación |
| `/perfumes` | Catálogo con filtros por colección, familia olfativa, búsqueda (nombre, casa o nota) y orden. Los filtros viven en la URL: `/perfumes?genero=mujer&perfil=florales&q=vainilla` |
| `/perfumes/<id>` | Ficha: compra (presentación, cantidad, carrito, WhatsApp, Addi), pirámide olfativa, experiencia y recomendaciones |

Cada ruta se entrega prerenderizada (título, descripción, canonical, Open Graph y JSON-LD
`Product` + `BreadcrumbList` propios), y React la hidrata en el navegador.

## Decisiones de contenido

- **Logo**: `source-material/logo-oficial.png`. En fondos oscuros se usa la misma pieza con el
  relleno negro de la palabra NARCISO llevado a marfil (`logo-reverse`); el emblema y el bisel
  dorado no se tocan. En fondos claros, el original.
- **Fotos**: las fotos de producto son las originales del cliente (no se alteran: solo se
  recodifican a AVIF/WebP). El hero y la promoción usan el recorte real del frasco
  (`botella-oficial.png`) y un desenfoque de la estantería real de esencias.
- **"Inspirado en"**: el sitio nunca sugiere que vende el perfume original. El pie de página lo
  aclara y cada ficha cita la referencia olfativa.
- **Perfiles olfativos**: se calculan con la familia y las ocasiones verificadas de cada ficha
  (`profiles.js`); no hay asignaciones a mano. "Acordes de familia" son las palabras de la familia
  olfativa verificada; "Para quién" se arma solo con ocasión, momento y estación de la ficha.
- **Catálogo** (`catalog.js`): el Excel del cliente "catalogo narciso cantabria" (2026-10-23) es
  la lista exacta: 263 fragancias (91 Dama, 132 Caballero, 40 Unisex), en su orden y sección. El
  2026-10-26 el cliente agregó 3 por mensaje: D092 Good Girl ("Girl Clásico", con la foto y la ficha
  del catálogo anterior), C133 Hawas Black ("Noche Oscura") y C134 1 Million Black ("Hombre de
  Negro"); estas dos, con ficha verificada en dos fuentes y el frasco recortado mientras no haya foto.
  Total: 266 (92 Dama, 134 Caballero, 40 Unisex).
  Cada fila se cruzó con el catálogo anterior (un agente empareja, otro intenta refutar, un
  tercero desempata): 258 conservan id, foto y ficha; 5 son nuevas, con ficha verificada en dos
  fuentes; salen 25 que no están en el Excel. Detalle y dudas en `docs/revision-catalogo.md`.
- **Código**: el de la columna CODIGO del Excel (D001…, C001…, UNI001…), en la esquina superior
  derecha de cada tarjeta y de la foto de la ficha. Se puede buscar por código en el catálogo y es el
  `sku` del JSON-LD.
- **Precios**: 50 ml $40.000 y 100 ml $60.000 COP para todo el catálogo (`SIZES` en
  `products.js`); cada tarjeta y ficha tiene selector de presentación.
- **Nombres comerciales** del Excel (columna "INSPIRACION"): son el nombre principal de cada
  fragancia, con "Inspirado en <perfume> de <casa>" debajo. Se publican tal como los mandó el
  cliente (2026-10-24), con solo mayúsculas y errores de tipeo evidentes corregidos, aunque
  algunos se repitan entre perfumes distintos. `SHOW_COMMERCIAL_NAMES = false` en `products.js`
  vuelve a mostrar solo el nombre del perfume original.
- **Promoción**: la de 3 por $130.000 se retiró por decisión del cliente. Sin promociones activas
  desaparecen el enlace del menú, el bloque de portada y el aviso del carrito. Si una promoción
  lleva `validUntil`, la vigencia se calcula con la fecha del build: hay que recompilar y publicar
  el día siguiente al vencimiento para que deje de verse.
- **Pago**: no hay pasarela integrada. El pedido se envía por WhatsApp (transferencia o Addi) y la
  interfaz lo muestra como *pendiente de confirmación y pago*, nunca como pagado. El carrito solo
  se vacía cuando el cliente confirma que envió el mensaje. `lib/order.js` documenta cómo añadir
  una pasarela.

## Pendiente de confirmar con el cliente

Estos datos no existen todavía; el sitio está preparado y no muestra nada inventado:

1. **Tarifa de envío** — `shipping.rate` en `src/data/site.js`. Con un valor, el carrito la suma.
2. **Observaciones del Excel (opcionales)** — ver `docs/revision-catalogo.md`: nombres
   comerciales repetidos o que copian marcas, identificaciones dudosas como "Carolina Herrera"
   D050 y cambios de sección. El sitio ya está publicado con todo tal como lo mandó el cliente.
3. **Fotos de "Carolina Herrera" (D050), Hawas Black (C133) y 1 Million Black (C134)** — sin foto
   propia (usan el frasco recortado).
4. **Inventario** — no hay sistema de existencias; la disponibilidad se confirma por WhatsApp.
5. **Pasarela de pago** — si se contrata (Wompi, Mercado Pago, Bold…), conectarla en `lib/order.js`.
6. **Fichas olfativas** de Eros Pour Femme, Vega y Arrurrú — sin fuente fiable; sus fichas lo dicen.
7. **Horario de atención** de la tienda en Ibagué (no se publica porque no se conoce).
8. **Dominio** — por defecto `https://narcisoparfum.com` (cambiar con `VITE_SITE_URL` al compilar).

## Publicación (Hostinger)

narcisoparfum.com está en Hostinger (plan Premium, carpeta `public_html`). Se publica desde el
Administrador de archivos de hPanel, sin FTP:

1. `npm run build`.
2. Empaquetar `dist/` en zips de menos de 9 MB: las fotos de `img/perfumes` en varios y el resto
   del sitio (con `.htaccess`) en uno. Las fotos van primero: el sitio solo cambia al
   descomprimir el zip que trae `index.html`.
3. Subir cada zip a `public_html` y usar **Extract** con destino `..` y nombre de carpeta
   `public_html` (así descomprime dentro de `public_html` sin crear subcarpetas).
4. Enviar los zips a la papelera.
5. Si cambió el `.htaccess`, vaciar la caché de la CDN (hPanel → Rendimiento → CDN → Flush
   cache): la CDN guarda también las redirecciones y seguiría sirviendo las viejas.

El `.htaccess` declara los tipos AVIF/WebP (el servidor servía `.avif` como texto), antepone
`index.html` al `default.php` de Hostinger, manda www y las URL con `.html` a la URL limpia
en un solo salto y responde 404 en carpetas sin `index.html` (sin esto LiteSpeed entraba en un
bucle de redirecciones). Caché: el HTML siempre fresco; fotos, logo e íconos (sin hash, se
reemplazan con el mismo nombre) 7 días; `/assets` (con hash) un año, por `assets/.htaccess`,
que debe ir en el zip. Una foto de perfume reemplazada se regenera con `npm run assets` (compara
fechas) y llega a todos en una semana como máximo. Verificado tras publicar: todas las fichas y sus fotos
responden 200, rutas inexistentes dan 404 real, HTTP redirige a HTTPS y no hay errores de consola.
