// Catálogo real de Narciso Parfum. Datos provistos por el cliente — no se
// inventan nombres, precios ni categorías. Todas las fragancias comparten el
// mismo frasco/etiqueta real (foto de source-material/botellabien.png), tal
// como se venden realmente: mismo envase, distinta esencia por dentro.
//
// Para agregar más productos en el futuro: solo hace falta añadir un objeto
// más a este arreglo (o crear un nuevo arreglo y hacer spread en `products`
// más abajo). No hay que tocar ningún componente.

export const CATEGORIES = {
  CABALLERO: 'Perfumería Caballero',
  DAMA: 'Perfumería Dama',
  UNISEX: 'Perfumería Unisex',
}

// Fotos reales individuales por producto (agosto 2026): el cliente mandó
// Desktop\portadas con una foto por referencia — mismo frasco Narciso real
// en primer plano, nítido, con el frasco de la fragancia real en la que se
// inspira desenfocado de fondo. Se revisaron las 257 (1 se descartó por
// defectuosa) y se generaron en src/assets/img/products/<id>.*. Después el
// cliente mandó Catalogo_Narciso_3.pdf con una segunda toma/render de la
// misma composición para los mismos 257 códigos; a pedido explícito del
// cliente ("que todas sean con el mismo fondo") se unificaron las 256 fotos
// usando siempre esta segunda toma (mismo estudio/iluminación en todas, en
// vez de mezclar dos sets distintos), incluida la que antes había salido
// defectuosa (esta vez sin defecto, así que ya tiene foto propia).
// Verificación posterior (13 agentes + segunda opinión independiente por
// caso dudoso) confirmó 8 fotos cuyo frasco de fondo NO corresponde a la
// marca/fragancia real que el producto dice representar (ej. Burberry Her
// Elixir con un frasco crema en vez del rojo/granate real) — se sacaron de
// este set y volvieron a usar la foto genérica hasta tener una foto
// corregida del cliente. Después el cliente mandó `Desktop\
// NARCISO_NUEVOS_CABALLEROS` (11 fotos con nombre de archivo = nombre del
// producto): 6 reemplazos de fotos ya buenas y 5 fotos nuevas — entre
// ellas, las correcciones de 2 de los 8 mal-emparejados (`myslf-le-parfum-
// yves-saint-laurent-hombre`, `luna-rossa-carbon-prada-hombre`) y 3 de los
// productos que nunca habían tenido código en el esquema original
// (`hawas-ice-rasasi-hombre`, `odyssey-mandarin-sky-armaf-hombre`,
// `supremacy-collector-s-edition-afnan-hombre`) — ver
// `scripts/apply-nuevos-caballeros.mjs`.
//
// El cliente después mandó fotos reales (de producto, no del sitio) de 4
// fragancias para confirmar/descartar el veredicto de la verificación
// automática: Bade'e Al Oud Honor & Glory (blanco con detalle dorado, NO
// el frasco negro que estábamos usando — confirmó mal-emparejamiento
// nuevo, no detectado antes) y Her EDP / Scandal / Yara Tous (las 3
// resultaron ser en realidad fotos CORRECTAS — la verificación automática
// se había equivocado al juzgar el diseño real de esos frascos, ej. asumió
// que Scandal no tiene una figura humana en la tapa cuando en realidad su
// tapa real SÍ es una figurilla dorada en forma de pierna/acróbata). Se
// restauraron esas 3 y se sacó `bade-e-al-oud-honor-glory-lattafa-unisex`.
// Para Her Elixir se buscó en el PDF si existía otra página con el frasco
// real — la búsqueda inicial asumió que solo había una página (D009) y que
// mostraba el mismo frasco pálido que Her EDP, así que quedó sin foto
// propia por un tiempo (ver entrada de abajo sobre la corrección).
//
// Lección: la verificación automática (agentes + segunda opinión) puede
// fallar en diseños de frascos muy específicos/nicho que no conoce bien —
// las fotos reales que manda el cliente son la fuente de verdad más
// confiable, por encima del juicio de los agentes.
//
// El cliente después mandó `Desktop\NARCISO_NUEVOS_DAMAS` y
// `Desktop\NARCISO_NUEVOS_UNISEX` (hermanas de NARCISO_NUEVOS_CABALLEROS,
// mismo esquema de nombre de archivo = nombre del producto): 18 fotos —
// 12 reemplazos de fotos ya buenas y 6 nuevas que cierran 6 de los 7
// productos que quedaban sin foto propia (`octans-ahli-unisex`,
// `bade-e-al-oud-honor-glory-lattafa-unisex`,
// `rehab-initio-parfums-prives-unisex`,
// `club-de-nuit-precieux-i-armaf-unisex`, `hawas-fire-rasasi-unisex`,
// `9-pm-rebel-afnan-unisex`) — ver `scripts/apply-nuevos-damas-unisex.mjs`.
// El único que seguía sin foto propia era `her-elixir-burberry-mujer`: las
// 3 tomas resueltas hasta entonces (portadas D009, `Catalogo_Narciso_3.pdf`
// vía el mapeo código→producto, y `Burberry_Her_Elixir.jpg` de
// NARCISO_NUEVOS_DAMAS) mostraban el mismo frasco pálido/crema que Her EDP.
//
// 2026-09-05 — corregido: el cliente mandó una foto de referencia real del
// frasco oficial de Burberry Her Elixir de Parfum (rosa pálido, tapa
// redondeada, "BURBERRY" en relieve en la base) y confirmó el nombre —
// coincide con el bottle real que Burberry vende (verificado también en
// burberry.com). Al extraer la imagen de la página 9 del PDF directamente
// con pdfimages -f 9 -l 9 (en vez de reutilizar el archivo `new_<id>.jpg`
// ya generado por el cruce código→producto), apareció un frasco rosado
// redondeado DISTINTO al crema/caja de Her EDP — visualmente igual al
// bottle real. Se confirmó que el archivo `new_her-elixir-burberry-mujer.jpg`
// generado en la sesión de agosto era, de hecho, una copia accidental del
// de Her EDP (ambos con bytes/composición casi idénticos) — un bug real del
// cruce de esa sesión, no una limitación del proveedor como se había
// concluido. Las 7 versiones del PDF que el cliente reenvió con el tiempo
// (`Catalogo_Narciso.pdf` a `_6`) muestran consistentemente ese mismo
// frasco rosado correcto en la página 9. Ver nota fechada en
// project_narciso_parfum.md para el detalle completo.
//
// Con esta corrección, los 262 productos ya tienen foto propia — ver
// ProductCard.jsx y ProductDetailPage.jsx, que resuelven `image` con
// `import.meta.glob` sobre `src/assets/img/products/`.
//
// 2026-10-10 — fotos de los 17 agregados el 2026-10-06: el material que
// llegó (`Downloads\Catalogo Perfumes\Nuevos sin fondo`, v2 del 7 de
// octubre) trae el fondo dorado vacío y un recorte del frasco real de cada
// inspiración, pero NO el frasco Narciso. Se compusieron con la misma
// distribución que el resto (Narciso nítido adelante, inspiración
// desenfocada atrás) usando `source-material/botella-oficial.png` — ver
// `scripts/compose-nuevos-octubre.mjs` y `source-material/nuevos-octubre-2026/`.
// El recorte de "Cloud" (Ariana Grande) que venía en el mismo lote no se
// usó: ese producto ya tenía foto propia del cliente. Catálogo: 283 de 283
// con foto propia.
const PRODUCTS_WITH_OWN_PHOTO = new Set([
  '1-million-elixir-paco-rabanne-hombre', '1-million-lucky-paco-rabanne-hombre', '1-million-paco-rabanne-hombre', '1-million-prive-paco-rabanne-hombre', '212-nyc-carolina-herrera-hombre', '212-nyc-carolina-herrera-mujer',
  '212-sexy-carolina-herrera-mujer', '212-sexy-men-carolina-herrera-hombre', '212-vip-black-carolina-herrera-hombre', '212-vip-black-extra-carolina-herrera-hombre', '212-vip-black-i-love-ny-carolina-herrera-hombre', '212-vip-black-red-carolina-herrera-hombre',
  '212-vip-carolina-herrera-hombre', '212-vip-carolina-herrera-mujer', '212-vip-rose-carolina-herrera-mujer', '212-vip-wild-party-carolina-herrera-mujer', '9-pm-rebel-afnan-unisex', '9am-dive-afnan-unisex', '9pm-afnan-hombre',
  'a-men-mugler-hombre', 'acqua-di-gio-giorgio-armani-hombre', 'acqua-di-gio-parfum-giorgio-armani-hombre', 'acqua-di-gio-profumo-giorgio-armani-hombre', 'acqua-di-gioia-giorgio-armani-mujer', 'agua-del-sol-escada-mujer',
  'allure-homme-sport-chanel-hombre', 'althair-parfums-de-marly-unisex', 'amber-oud-aqua-dubai-al-haramain-unisex', 'amber-rouge-orientica-unisex', 'ange-ou-demon-givenchy-mujer', 'angels-share-kilian-paris-unisex', 'aqva-pour-homme-bvlgari-hombre',
  'arabians-tonka-montale-unisex', 'ari-ariana-grande-mujer', 'armani-code-edt-giorgio-armani-hombre', 'arrurru-arrurru-unisex', 'art-of-universe-lattafa-unisex', 'aventus-creed-unisex',
  'aventus-for-her-creed-mujer', 'baccarat-rouge-540-maison-francis-kurkdjian-unisex', 'bad-boy-carolina-herrera-hombre', 'bad-boy-elixir-carolina-herrera-hombre', 'bad-diesel-hombre', 'bade-e-al-oud-amethyst-lattafa-unisex',
  'bade-e-al-oud-honor-glory-lattafa-unisex', 'bade-e-al-oud-sublime-lattafa-unisex', 'bff-kim-kardashian-mujer', 'bianco-latte-giardini-di-toscana-unisex', 'black-opium-yves-saint-laurent-mujer', 'black-orchid-tom-ford-unisex',
  'black-xs-l-exces-paco-rabanne-hombre', 'bleecker-street-bond-no-9-unisex', 'bleu-de-chanel-chanel-hombre', 'blue-label-givenchy-hombre', 'blue-seduction-antonio-banderas-hombre', 'bombshell-victoria-s-secret-mujer',
  'bottled-elixir-hugo-boss-hombre', 'bottled-night-hugo-boss-hombre', 'bottled-parfum-hugo-boss-hombre', 'bottled-tonic-hugo-boss-hombre', 'bottled-unlimited-hugo-boss-hombre', 'bright-crystal-parfum-versace-mujer',
  'burberry-hero-edp-burberry-hombre', 'bvlgari-man-bvlgari-hombre', 'can-can-paris-hilton-mujer', 'canes-ahli-unisex', 'carmina-creed-mujer', 'centaurus-creed-unisex',
  'ch-men-africa-carolina-herrera-hombre', 'ch-men-carolina-herrera-hombre', 'ch-prive-edt-carolina-herrera-hombre', 'ch-sublime-carolina-herrera-mujer', 'chance-chanel-mujer', 'chance-eau-fraiche-chanel-mujer',
  'ck-in2u-calvin-klein-mujer', 'ck-one-calvin-klein-unisex', 'ck-one-reflections-calvin-klein-unisex', 'cloud-ariana-grande-mujer', 'cloud-pink-ariana-grande-mujer', 'club-de-nuit-milestone-armaf-unisex', 'club-de-nuit-precieux-i-armaf-unisex',
  'coco-mademoiselle-chanel-mujer', 'coconut-passion-victoria-s-secret-mujer', 'costa-azzurra-tom-ford-unisex', 'crystal-noir-parfum-versace-mujer', 'devotion-dolce-gabbana-mujer', 'dior-homme-sport-dior-hombre',
  'divine-le-parfum-jean-paul-gaultier-mujer', 'donna-born-in-roma-coral-fantasy-valentino-mujer', 'donna-born-in-roma-green-stravaganza-valentino-mujer', 'donna-born-in-roma-valentino-mujer', 'drakkar-noir-guy-laroche-hombre', 'eclaire-lattafa-unisex',
  'elysium-pour-homme-roja-parfums-unisex', 'erba-pura-xerjoff-unisex', 'eros-energy-versace-hombre', 'eros-flame-versace-hombre', 'eros-pour-femme-versace-mujer', 'eros-versace-hombre',
  'eternity-calvin-klein-hombre', 'euphoria-calvin-klein-hombre', 'euphoria-calvin-klein-mujer', 'exclusive-azure-fantasy-orientica-mujer', 'explorer-platinum-montblanc-hombre', 'fahrenheit-dior-hombre',
  'fame-paco-rabanne-mujer', 'flamenco-ramon-monegal-unisex', 'good-girl-blush-carolina-herrera-mujer', 'good-girl-blush-elixir-carolina-herrera-mujer', 'good-girl-carolina-herrera-mujer', 'hacivat-nishane-unisex',
  'hawas-fire-rasasi-unisex', 'hawas-ice-rasasi-hombre', 'her-edp-burberry-mujer', 'her-elixir-burberry-mujer', 'herod-parfums-de-marly-unisex', 'il-dolce-ilmin-unisex', 'il-femme-ilmin-unisex', 'il-kakuno-ilmin-unisex',
  'il-mexico-ilmin-unisex', 'il-orgasme-ilmin-unisex', 'imagination-louis-vuitton-unisex', 'in-motion-hugo-boss-hombre', 'in2u-for-him-calvin-klein-hombre', 'instant-crush-mancera-unisex',
  'intense-cafe-montale-unisex', 'invictus-legend-paco-rabanne-hombre', 'invictus-onyx-paco-rabanne-hombre', 'invictus-paco-rabanne-hombre', 'invictus-parfum-paco-rabanne-hombre', 'invictus-platinum-paco-rabanne-hombre',
  'invictus-victory-elixir-paco-rabanne-hombre', 'irresistible-givenchy-mujer', 'island-bliss-armaf-unisex', 'k-by-dolce-gabbana-dolce-gabbana-hombre', 'karpos-ahli-unisex', 'khamrah-dukhan-lattafa-unisex',
  'khamrah-qahwa-lattafa-unisex', 'king-of-seduction-antonio-banderas-hombre', 'l-12-12-blanc-lacoste-hombre', 'l-12-12-noir-lacoste-hombre', 'l-12-12-rouge-lacoste-hombre', 'l-eau-d-issey-issey-miyake-mujer', 'l-eau-d-issey-pour-homme-issey-miyake-hombre',
  'l-immensite-louis-vuitton-unisex', 'l-imperatrice-3-dolce-gabbana-mujer', 'la-belle-le-parfum-jean-paul-gaultier-mujer', 'la-bomba-carolina-herrera-mujer', 'la-nuit-de-l-homme-yves-saint-laurent-hombre', 'la-nuit-tresor-lancome-mujer',
  'la-vie-est-belle-l-elixir-lancome-mujer', 'lady-million-lucky-paco-rabanne-mujer', 'lady-million-paco-rabanne-mujer', 'lady-million-royal-paco-rabanne-mujer', 'layton-parfums-de-marly-unisex', 'le-beau-le-parfum-jean-paul-gaultier-hombre',
  'le-beau-paradise-garden-jean-paul-gaultier-hombre', 'le-male-elixir-absolu-jean-paul-gaultier-hombre', 'le-male-jean-paul-gaultier-hombre', 'le-male-le-parfum-jean-paul-gaultier-hombre', 'levar-del-sole-xerjoff-casamorati-unisex', 'libre-yves-saint-laurent-mujer',
  'light-blue-dolce-gabbana-mujer', 'light-blue-pour-homme-dolce-gabbana-hombre', 'love-addict-victoria-s-secret-mujer', 'luna-rossa-carbon-prada-hombre', 'luna-rossa-ocean-prada-hombre', 'mallow-madness-lattafa-mujer',
  'man-in-black-bvlgari-hombre', 'meow-katy-perry-mujer', 'miami-blossom-escada-mujer', 'millesime-imperial-creed-unisex', 'miss-dior-blooming-bouquet-dior-mujer', 'miss-dior-parfum-dior-mujer',
  'mod-vanilla-ariana-grande-mujer', 'myslf-le-parfum-yves-saint-laurent-hombre', 'n-5-chanel-mujer', 'neroli-portofino-tom-ford-unisex', 'new-york-signature-bond-no-9-unisex', 'niche-femme-bharara-unisex',
  'noble-blush-lattafa-mujer', 'nolita-bond-no-9-mujer', 'octans-ahli-unisex', 'odyssey-mandarin-sky-armaf-hombre', 'odyssey-mandarin-sky-elixir-armaf-unisex', 'olympea-parfum-paco-rabanne-mujer', 'ombre-nomade-louis-vuitton-unisex',
  'omnia-amethyste-bvlgari-mujer', 'omnia-crystalline-bvlgari-mujer', 'omnia-pink-sapphire-bvlgari-mujer', 'one-shock-for-him-calvin-klein-hombre', 'onyx-bharara-unisex', 'orange-hugo-boss-hombre',
  'organza-givenchy-mujer', 'oud-maracuja-maison-crivelli-unisex', 'pacific-chill-louis-vuitton-unisex', 'paradoxe-intense-prada-mujer', 'passport-paris-paris-hilton-mujer', 'petits-et-mamans-bvlgari-unisex',
  'phantom-elixir-paco-rabanne-hombre', 'phantom-intense-paco-rabanne-hombre', 'pineapple-dolce-gabbana-mujer', 'polo-red-ralph-lauren-hombre', 'polo-ultra-blue-ralph-lauren-hombre', 'pour-femme-dylan-purple-versace-mujer',
  'pour-homme-bvlgari-hombre', 'pour-homme-dylan-blue-versace-hombre', 'pour-homme-intenso-dolce-gabbana-hombre', 'pure-seduction-victoria-s-secret-mujer', 'pure-xs-paco-rabanne-hombre', 'q-dolce-gabbana-mujer',
  'red-hugo-boss-hombre', 'red-tobacco-mancera-unisex', 'rehab-initio-parfums-prives-unisex', 'reserve-privee-givenchy-hombre', 'santal-33-le-labo-unisex', 'santos-de-cartier-cartier-hombre',
  'sauvage-edt-dior-hombre', 'sauvage-elixir-dior-hombre', 'scandal-jean-paul-gaultier-mujer', 'scandal-pour-homme-jean-paul-gaultier-hombre', 'sex-sea-lorenzo-pazzaglia-unisex', 'si-edp-intensely-giorgio-armani-mujer',
  'si-giorgio-armani-mujer', 'silver-mountain-water-creed-unisex', 'sofia-sofia-vergara-mujer', 'sorbetto-rosso-escada-mujer', 'speachless-lorenzo-pazzaglia-unisex', 'starry-nights-montale-unisex',
  'starwalker-montblanc-hombre', 'stronger-with-you-giorgio-armani-hombre', 'stronger-with-you-intensely-giorgio-armani-hombre', 'stronger-with-you-tobacco-giorgio-armani-hombre', 'sugardaddy-fugazzi-unisex', 'summer-hammer-lorenzo-pazzaglia-unisex',
  'sun-gria-lorenzo-pazzaglia-unisex', 'supremacy-collector-s-edition-afnan-hombre', 'sweet-candy-ariana-grande-mujer', 'swiss-army-classic-victorinox-hombre', 'symphony-louis-vuitton-unisex', 'thank-u-next-ariana-grande-mujer', 'the-one-for-men-dolce-gabbana-hombre',
  'the-one-sport-dolce-gabbana-hombre', 'the-queen-and-the-viper-stephane-humbert-lucas-777-unisex', 'the-scent-elixir-hugo-boss-hombre', 'tommy-tommy-hilfiger-hombre', 'toy-2-bubble-gum-moschino-mujer', 'toy-2-moschino-mujer',
  'torino21-xerjoff-hombre', 'toy-boy-moschino-hombre', 'ultra-male-jean-paul-gaultier-hombre', 'unstoppable-hong-kong-elivi-parfums-hombre', 'uomo-born-in-roma-extradose-valentino-hombre', 'uomo-born-in-roma-green-stravaganza-valentino-hombre', 'uomo-born-in-roma-valentino-hombre', 'uomo-valentino-hombre',
  'vega-ahli-unisex', 'velvet-petals-victoria-s-secret-mujer', 'very-good-girl-glam-carolina-herrera-mujer', 'voyage-nautica-hombre', 'yara-candy-lattafa-mujer', 'yara-lattafa-mujer',
  'y-eau-de-parfum-yves-saint-laurent-hombre', 'yara-moi-lattafa-mujer', 'yara-tous-lattafa-mujer', 'yum-yum-armaf-mujer',
  // 2026-10-10: compuestas con scripts/compose-nuevos-octubre.mjs (ver arriba).
  'emeer-lattafa-hombre', 'uomo-born-in-roma-purple-melancholia-valentino-hombre', 'champagne-blue-bharara-hombre', 'loewe-7-loewe-hombre',
  'cedrat-boise-mancera-hombre', 'green-irish-tweed-creed-hombre', 'pharaoh-ramesses-i-bharara-hombre', 'paradigme-prada-hombre',
  'the-most-wanted-azzaro-hombre', 'uomo-born-in-roma-intense-valentino-hombre', 'nitro-red-intensely-dumont-hombre', 'hawas-for-him-rasasi-hombre',
  'vulcan-baie-french-avenue-mujer', 'yum-boujee-marshmallow-81-kayali-mujer', 'qaed-al-fursan-lattafa-unisex', 'drunk-lovers-born-to-stand-out-unisex',
  'toxic-desire-korbaj-unisex',
])

// `style` = familia olfativa general (Fresco / Dulce / Intenso / Elegante),
// solo para agrupar en el buscador de fragancias — es una clasificación
// orientativa de conocimiento público sobre estas fragancias reales, no un
// dato provisto por el cliente ni una característica inventada del producto.
const caballero = [
  { title: 'King of Seduction', brand: 'Antonio Banderas', style: 'Dulce' },
  { title: 'Acqua di Gio Parfum', brand: 'Giorgio Armani', style: 'Fresco' },
  { title: 'Blue Seduction', brand: 'Antonio Banderas', style: 'Fresco' },
  { title: 'Acqua di Gio', brand: 'Giorgio Armani', style: 'Fresco' },
  { title: 'Armani Code EDT', brand: 'Giorgio Armani', style: 'Elegante' },
  { title: 'Stronger With You Tobacco', brand: 'Giorgio Armani', style: 'Intenso' },
  { title: 'Stronger With You Intensely', brand: 'Giorgio Armani', style: 'Intenso' },
  { title: 'Acqua di Gio Profumo', brand: 'Giorgio Armani', style: 'Elegante' },
  { title: 'Aqva Pour Homme', brand: 'Bvlgari', style: 'Fresco' },
  { title: 'Burberry Hero EDP', brand: 'Burberry', style: 'Intenso' },
  { title: 'Man in Black', brand: 'Bvlgari', style: 'Intenso' },
  { title: 'Bvlgari Man', brand: 'Bvlgari', style: 'Elegante' },
  { title: '212 Sexy Men', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Euphoria', brand: 'Calvin Klein', style: 'Intenso' },
  { title: 'Eternity', brand: 'Calvin Klein', style: 'Elegante' },
  { title: '212 NYC', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: '212 VIP Black Red', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: '212 VIP Black Extra', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: '212 VIP Black', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: '212 VIP Black I Love NY', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: '212 VIP', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Réserve Privée', brand: 'Givenchy', style: 'Elegante' },
  { title: 'Sauvage EDT', brand: 'Dior', style: 'Fresco' },
  { title: 'CH Privé EDT', brand: 'Carolina Herrera', style: 'Elegante' },
].map((p) => toProduct(p, CATEGORIES.CABALLERO, 'hombre'))

const dama = [
  { title: 'Sì EDP Intensely', brand: 'Giorgio Armani', style: 'Dulce' },
  { title: 'Thank U, Next', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Ari', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Acqua di Gioia', brand: 'Giorgio Armani', style: 'Fresco' },
  { title: 'Mod Vanilla', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Cloud Pink', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Her Elixir', brand: 'Burberry', style: 'Intenso' },
  { title: 'Miss Dior Parfum', brand: 'Dior', style: 'Elegante' },
  { title: 'Her EDP', brand: 'Burberry', style: 'Dulce' },
  { title: 'Euphoria', brand: 'Calvin Klein', style: 'Intenso' },
  { title: '212 Sexy', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Sweet Candy', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Sì', brand: 'Giorgio Armani', style: 'Dulce' },
  { title: 'Good Girl Blush', brand: 'Carolina Herrera', style: 'Dulce' },
  { title: '212 VIP', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: '212 VIP Rosé', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Very Good Girl Glam', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: 'Chance Eau Fraîche', brand: 'Chanel', style: 'Fresco' },
  { title: 'La Bomba', brand: 'Carolina Herrera', style: 'Elegante' },
  { title: 'Good Girl Blush Elixir', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: 'Miss Dior Blooming Bouquet', brand: 'Dior', style: 'Fresco' },
  { title: 'Chance', brand: 'Chanel', style: 'Elegante' },
  { title: 'CH Sublime', brand: 'Carolina Herrera', style: 'Elegante' },
  { title: 'Libre', brand: 'Yves Saint Laurent', style: 'Elegante' },
].map((p) => toProduct(p, CATEGORIES.DAMA, 'mujer'))

// Ampliación de catálogo (agosto 2026): referencias reales adicionales que el
// cliente compartió en su hoja de cálculo de códigos (259 referencias en
// total). Se agregaron solo las que no duplicaban el catálogo ya existente;
// marca, título y familia olfativa se verificaron uno por uno por internet
// (no se inventó ningún dato). Mismo precio plano $60.000 que el resto de
// la colección.
const caballeroAgosto2026 = [
  { title: 'Stronger With You', brand: 'Giorgio Armani', style: 'Intenso' },
  { title: 'Pour Homme', brand: 'Bvlgari', style: 'Fresco' },
  { title: 'IN2U for Him', brand: 'Calvin Klein', style: 'Fresco' },
  { title: 'One Shock for Him', brand: 'Calvin Klein', style: 'Fresco' },
  { title: 'CH Men Africa', brand: 'Carolina Herrera', style: 'Dulce' },
  { title: 'Bad Boy', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: 'Bad Boy Elixir', brand: 'Carolina Herrera', style: 'Intenso' },
  { title: 'CH Men', brand: 'Carolina Herrera', style: 'Elegante' },
  { title: 'Santos de Cartier', brand: 'Cartier', style: 'Elegante' },
  { title: 'Allure Homme Sport', brand: 'Chanel', style: 'Fresco' },
  { title: 'Bleu de Chanel', brand: 'Chanel', style: 'Fresco' },
  { title: 'Dior Homme Sport', brand: 'Dior', style: 'Fresco' },
  { title: 'Bad', brand: 'Diesel', style: 'Intenso' },
  { title: 'Pour Homme Intenso', brand: 'Dolce & Gabbana', style: 'Intenso' },
  { title: 'K by Dolce & Gabbana', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'Light Blue pour Homme', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'The One for Men', brand: 'Dolce & Gabbana', style: 'Elegante' },
  { title: 'The One Sport', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'Blue Label', brand: 'Givenchy', style: 'Fresco' },
  { title: 'Drakkar Noir', brand: 'Guy Laroche', style: 'Intenso' },
  { title: 'Bottled Night', brand: 'Hugo Boss', style: 'Intenso' },
  { title: 'Bottled Parfum', brand: 'Hugo Boss', style: 'Elegante' },
  { title: 'Bottled Elixir', brand: 'Hugo Boss', style: 'Intenso' },
  { title: 'In Motion', brand: 'Hugo Boss', style: 'Fresco' },
  { title: 'Orange', brand: 'Hugo Boss', style: 'Fresco' },
  { title: 'Red', brand: 'Hugo Boss', style: 'Fresco' },
  { title: 'The Scent Elixir', brand: 'Hugo Boss', style: 'Intenso' },
  { title: 'Bottled Tonic', brand: 'Hugo Boss', style: 'Fresco' },
  { title: 'Bottled Unlimited', brand: 'Hugo Boss', style: 'Fresco' },
  { title: 'Le Beau Le Parfum', brand: 'Jean Paul Gaultier', style: 'Dulce' },
  { title: 'Le Beau Paradise Garden', brand: 'Jean Paul Gaultier', style: 'Fresco' },
  { title: 'Scandal Pour Homme', brand: 'Jean Paul Gaultier', style: 'Dulce' },
  { title: 'Le Male Le Parfum', brand: 'Jean Paul Gaultier', style: 'Dulce' },
  { title: 'Le Male Elixir Absolu', brand: 'Jean Paul Gaultier', style: 'Intenso' },
  { title: 'Le Male', brand: 'Jean Paul Gaultier', style: 'Fresco' },
  { title: 'Ultra Male', brand: 'Jean Paul Gaultier', style: 'Intenso' },
  { title: 'L.12.12 Blanc', brand: 'Lacoste', style: 'Fresco' },
  { title: 'L.12.12 Rouge', brand: 'Lacoste', style: 'Fresco' },
  { title: 'L.12.12 Noir', brand: 'Lacoste', style: 'Intenso' },
  { title: 'Explorer Platinum', brand: 'Montblanc', style: 'Elegante' },
  { title: 'Starwalker', brand: 'Montblanc', style: 'Elegante' },
  { title: 'Toy Boy', brand: 'Moschino', style: 'Intenso' },
  { title: 'Voyage', brand: 'Nautica', style: 'Fresco' },
  { title: 'Black XS L\'Excès', brand: 'Paco Rabanne', style: 'Intenso' },
  { title: 'Invictus Onyx', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: 'Invictus Parfum', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: 'Invictus Platinum', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: 'Invictus Victory Elixir', brand: 'Paco Rabanne', style: 'Intenso' },
  { title: 'Invictus Legend', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: 'Invictus', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: '1 Million Elixir', brand: 'Paco Rabanne', style: 'Intenso' },
  { title: '1 Million Lucky', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: '1 Million', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: '1 Million Privé', brand: 'Paco Rabanne', style: 'Intenso' },
  { title: 'Phantom Elixir', brand: 'Paco Rabanne', style: 'Elegante' },
  { title: 'Phantom Intense', brand: 'Paco Rabanne', style: 'Intenso' },
  { title: 'Luna Rossa Carbon', brand: 'Prada', style: 'Fresco' },
  { title: 'Luna Rossa Ocean', brand: 'Prada', style: 'Fresco' },
  { title: 'Polo Ultra Blue', brand: 'Ralph Lauren', style: 'Fresco' },
  { title: 'Polo Red', brand: 'Ralph Lauren', style: 'Fresco' },
  { title: 'A*Men', brand: 'Mugler', style: 'Dulce' },
  { title: 'Tommy', brand: 'Tommy Hilfiger', style: 'Fresco' },
  { title: 'Uomo Born in Roma', brand: 'Valentino', style: 'Elegante' },
  { title: 'Uomo', brand: 'Valentino', style: 'Elegante' },
  { title: 'Uomo Born in Roma Extradose', brand: 'Valentino', style: 'Intenso' },
  { title: 'Uomo Born in Roma Green Stravaganza', brand: 'Valentino', style: 'Fresco' },
  { title: 'Pour Homme Dylan Blue', brand: 'Versace', style: 'Fresco' },
  { title: 'Eros Flame', brand: 'Versace', style: 'Intenso' },
  { title: 'Eros Energy', brand: 'Versace', style: 'Fresco' },
  { title: 'Eros', brand: 'Versace', style: 'Fresco' },
  { title: 'Swiss Army Classic', brand: 'Victorinox', style: 'Fresco' },
  { title: 'MYSLF Le Parfum', brand: 'Yves Saint Laurent', style: 'Intenso' },
  { title: '9PM', brand: 'Afnan', style: 'Intenso' },
  { title: 'Fahrenheit', brand: 'Dior', style: 'Intenso' },
  // El cliente pidió agregar estas igual aunque su texto original no
  // permitía confirmar el producto exacto sin ambigüedad (marca sola, o
  // varias variantes posibles) — se usó el producto real más representativo
  // de esa marca/línea en cada caso.
  { title: 'L\'Eau d\'Issey Pour Homme', brand: 'Issey Miyake', style: 'Fresco' },
  { title: 'Pure XS', brand: 'Paco Rabanne', style: 'Fresco' },
  { title: 'La Nuit de l\'Homme', brand: 'Yves Saint Laurent', style: 'Elegante' },
  // Lote adicional (mismo mes) con investigación olfativa completa: el
  // cliente dio él mismo las notas de salida/corazón/fondo de cada una, así
  // que sí tienen ficha en fragranceInfo.js (a diferencia del resto de esta
  // ampliación, que solo tiene `style`).
  { title: 'Hawas Ice', brand: 'Rasasi', style: 'Fresco' },
  { title: 'Supremacy Collector\'s Edition', brand: 'Afnan', style: 'Intenso' },
  { title: 'Odyssey Mandarin Sky', brand: 'Armaf', style: 'Fresco' },
  // Detectado al cruzar el catálogo con la hoja de fichas completas del
  // cliente (agosto 2026): "Dior Sauvage Elixir" es un producto real
  // distinto de "Sauvage EDT", que el dedup original de 259 referencias
  // había excluido por error como si fuera el mismo (falso positivo).
  { title: 'Sauvage Elixir', brand: 'Dior', style: 'Intenso' },
  // 2026-09-06: el cliente mandó foto propia real (frasco azul facetado real
  // de la línea "Y") y pidió agregarlo como producto nuevo de hombre.
  { title: 'Y Eau de Parfum', brand: 'Yves Saint Laurent', style: 'Fresco' },
  // 2026-09-10: estas 2 estaban como "Próximamente" (badges flotantes en el
  // Hero, sin precio) — el cliente pidió pasarlas al catálogo real de
  // caballero. Se quitaron las insignias flotantes al agregarlas aquí.
  // Excluidas explícitamente del cambio a $55.000/50ml del mismo día: el
  // cliente las nombró como excepción, así que mantienen $60.000 sin talla.
  { title: 'Torino21', brand: 'Xerjoff', style: 'Fresco', price: 60000, size: null },
  { title: 'Unstoppable Hong Kong', brand: 'Elivi Parfums', style: 'Intenso', price: 60000, size: null },
  // 2026-10-06: lote de 12 pedido por el cliente en una lista informal (con
  // errores de tipeo). Cada nombre se verificó contra Fragrantica y la marca;
  // todas con ficha completa en fragranceInfo.js; foto propia compuesta el
  // 2026-10-10 (ver PRODUCTS_WITH_OWN_PHOTO). Correcciones y ambigüedades
  // que conviene recordar:
  // - "Green iris twist" = Creed Green Irish Tweed; "intesly" = Nitro Red
  //   Intensely (Dumont); "melancolía" = Born in Roma Purple Melancholia.
  // - Emeer (Lattafa) y Cedrat Boisé (Mancera) figuran como unisex en
  //   Fragrantica; se dejaron en Caballero como los pidió el cliente.
  // - "Faraón ramses" es ambiguo (Pharaoh Ramesses I o II, ambas 2025): se
  //   eligió la I por ser la más parecida al texto. Confirmado el
  //   2026-10-10: el recorte del frasco que mandaron dice "PHARAOH RAMESSES I".
  // - "The Most Wanted" se tomó como la Eau de Parfum Intense (2021), que es
  //   la que las tiendas llaman solo así; existen también Parfum y EDT Intense.
  //   El recorte que mandaron es el barril negro mate, coherente con la EDP
  //   Intense (el Parfum lleva un degradado ámbar).
  { title: 'Emeer', brand: 'Lattafa', style: 'Fresco' },
  { title: 'Uomo Born in Roma Purple Melancholia', brand: 'Valentino', style: 'Dulce' },
  { title: 'Champagne Blue', brand: 'Bharara', style: 'Fresco' },
  { title: 'Loewe 7', brand: 'Loewe', style: 'Elegante' },
  { title: 'Cedrat Boisé', brand: 'Mancera', style: 'Fresco' },
  { title: 'Green Irish Tweed', brand: 'Creed', style: 'Fresco' },
  { title: 'Pharaoh Ramesses I', brand: 'Bharara', style: 'Dulce' },
  { title: 'Paradigme', brand: 'Prada', style: 'Elegante' },
  { title: 'The Most Wanted', brand: 'Azzaro', style: 'Intenso' },
  { title: 'Uomo Born in Roma Intense', brand: 'Valentino', style: 'Intenso' },
  { title: 'Nitro Red Intensely', brand: 'Dumont', style: 'Fresco' },
  { title: 'Hawas for Him', brand: 'Rasasi', style: 'Fresco' },
].map((p) => toProduct(p, CATEGORIES.CABALLERO, 'hombre'))

const damaAgosto2026 = [
  { title: 'CK IN2U', brand: 'Calvin Klein', style: 'Fresco' },
  { title: '212 VIP Wild Party', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Devotion', brand: 'Dolce & Gabbana', style: 'Dulce' },
  { title: 'Black Opium', brand: 'Yves Saint Laurent', style: 'Dulce' },
  { title: 'Coco Mademoiselle', brand: 'Chanel', style: 'Elegante' },
  { title: 'Nº5', brand: 'Chanel', style: 'Elegante' },
  { title: 'L\'Imperatrice 3', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'Light Blue', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'Q', brand: 'Dolce & Gabbana', style: 'Dulce' },
  { title: 'Sorbetto Rosso', brand: 'Escada', style: 'Fresco' },
  { title: 'Agua del Sol', brand: 'Escada', style: 'Fresco' },
  { title: 'Miami Blossom', brand: 'Escada', style: 'Fresco' },
  { title: 'Ange ou Démon', brand: 'Givenchy', style: 'Intenso' },
  { title: 'Irresistible', brand: 'Givenchy', style: 'Elegante' },
  { title: 'Organza', brand: 'Givenchy', style: 'Elegante' },
  { title: 'Pineapple', brand: 'Dolce & Gabbana', style: 'Fresco' },
  { title: 'Scandal', brand: 'Jean Paul Gaultier', style: 'Dulce' },
  { title: 'La Belle Le Parfum', brand: 'Jean Paul Gaultier', style: 'Dulce' },
  { title: 'Divine Le Parfum', brand: 'Jean Paul Gaultier', style: 'Elegante' },
  { title: 'La Vie Est Belle L\'Elixir', brand: 'Lancôme', style: 'Dulce' },
  { title: 'La Nuit Trésor', brand: 'Lancôme', style: 'Dulce' },
  { title: 'BFF', brand: 'Kim Kardashian', style: 'Dulce' },
  { title: 'Meow', brand: 'Katy Perry', style: 'Dulce' },
  { title: 'Omnia Pink Sapphire', brand: 'Bvlgari', style: 'Fresco' },
  { title: 'Omnia Amethyste', brand: 'Bvlgari', style: 'Elegante' },
  { title: 'Omnia Crystalline', brand: 'Bvlgari', style: 'Fresco' },
  { title: 'Toy 2 Bubble Gum', brand: 'Moschino', style: 'Dulce' },
  { title: 'Toy 2', brand: 'Moschino', style: 'Fresco' },
  { title: 'Fame', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: 'Lady Million', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: 'Lady Million Lucky', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: 'Lady Million Royal', brand: 'Paco Rabanne', style: 'Dulce' },
  { title: 'Olympéa Parfum', brand: 'Paco Rabanne', style: 'Elegante' },
  { title: 'Can Can', brand: 'Paris Hilton', style: 'Fresco' },
  { title: 'Sofía', brand: 'Sofía Vergara', style: 'Dulce' },
  { title: 'Donna Born in Roma Coral Fantasy', brand: 'Valentino', style: 'Fresco' },
  { title: 'Donna Born in Roma', brand: 'Valentino', style: 'Dulce' },
  { title: 'Bright Crystal Parfum', brand: 'Versace', style: 'Fresco' },
  { title: 'Crystal Noir Parfum', brand: 'Versace', style: 'Intenso' },
  { title: 'Pour Femme Dylan Purple', brand: 'Versace', style: 'Dulce' },
  { title: 'Eros Pour Femme', brand: 'Versace', style: 'Fresco' },
  { title: 'Bombshell', brand: 'Victoria\'s Secret', style: 'Fresco' },
  { title: 'Coconut Passion', brand: 'Victoria\'s Secret', style: 'Dulce' },
  { title: 'Pure Seduction', brand: 'Victoria\'s Secret', style: 'Fresco' },
  { title: 'Love Addict', brand: 'Victoria\'s Secret', style: 'Dulce' },
  { title: 'Velvet Petals', brand: 'Victoria\'s Secret', style: 'Dulce' },
  { title: 'Carmina', brand: 'Creed', style: 'Elegante' },
  { title: 'Yara Candy', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Yara', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Yara Tous', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Yara Moi', brand: 'Lattafa', style: 'Intenso' },
  { title: 'Nolita', brand: 'Bond No. 9', style: 'Fresco' },
  { title: 'Yum Yum', brand: 'Armaf', style: 'Dulce' },
  { title: 'Noble Blush', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Exclusive Azure Fantasy', brand: 'Orientica', style: 'Fresco' },
  { title: 'Donna Born in Roma Green Stravaganza', brand: 'Valentino', style: 'Dulce' },
  { title: 'Mallow Madness', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Paradoxe Intense', brand: 'Prada', style: 'Elegante' },
  { title: 'Aventus for Her', brand: 'Creed', style: 'Fresco' },
  // Igual que "Sauvage Elixir": detectados al cruzar el catálogo con la
  // hoja de fichas completas (agosto 2026) — "Cloud" (2018, distinto de
  // "Cloud Pink" ya existente) y "Good Girl" (el best-seller base de la
  // línea, distinto de sus flankers "Good Girl Blush"/"Very Good Girl Glam"
  // ya existentes) habían quedado fuera del catálogo por error.
  { title: 'Cloud', brand: 'Ariana Grande', style: 'Dulce' },
  { title: 'Good Girl', brand: 'Carolina Herrera', style: 'Intenso' },
  // El cliente pidió agregar estas igual aunque su texto original no
  // permitía confirmar el producto exacto sin ambigüedad (marca sola, o
  // varias variantes posibles) — se usó el producto real más representativo
  // de esa marca/línea en cada caso.
  { title: '212 NYC', brand: 'Carolina Herrera', style: 'Fresco' },
  { title: 'Passport Paris', brand: 'Paris Hilton', style: 'Fresco' },
  { title: 'L\'Eau d\'Issey', brand: 'Issey Miyake', style: 'Fresco' },
  // 2026-10-06 (mismo lote de la lista informal del cliente, ver arriba).
  // "Cloud" de Ariana Grande ya existía en el catálogo y no se duplicó.
  // Vulcan Baie figura como unisex en Fragrantica y en la mayoría de tiendas
  // (la web de French Avenue la etiqueta "For Her"); se dejó en Dama como la
  // pidió el cliente.
  { title: 'Vulcan Baie', brand: 'French Avenue', style: 'Dulce' },
  { title: 'Yum Boujee Marshmallow 81', brand: 'Kayali', style: 'Dulce' },
].map((p) => toProduct(p, CATEGORIES.DAMA, 'mujer'))

const unisex = [
  { title: 'CK One Reflections', brand: 'Calvin Klein', style: 'Fresco' },
  { title: 'CK One', brand: 'Calvin Klein', style: 'Fresco' },
  { title: 'Petits et Mamans', brand: 'Bvlgari', style: 'Dulce' },
  { title: '9AM Dive', brand: 'Afnan', style: 'Fresco' },
  { title: 'Karpos', brand: 'Ahli', style: 'Dulce' },
  { title: 'Vega', brand: 'Ahli', style: 'Dulce' },
  { title: 'Octans', brand: 'Ahli', style: 'Fresco' },
  { title: 'Canes', brand: 'Ahli', style: 'Fresco' },
  { title: 'Island Bliss', brand: 'Armaf', style: 'Dulce' },
  { title: 'Odyssey Mandarin Sky Elixir', brand: 'Armaf', style: 'Intenso' },
  { title: 'Onyx', brand: 'Bharara', style: 'Intenso' },
  { title: 'Niche Femme', brand: 'Bharara', style: 'Elegante' },
  { title: 'Bleecker Street', brand: 'Bond No. 9', style: 'Elegante' },
  { title: 'Aventus', brand: 'Creed', style: 'Intenso' },
  { title: 'Centaurus', brand: 'Creed', style: 'Intenso' },
  { title: 'Sugardaddy', brand: 'Fugazzi', style: 'Intenso' },
  { title: 'Bianco Latte', brand: 'Giardini di Toscana', style: 'Dulce' },
  { title: 'Amber Oud Aqua Dubai', brand: 'Al Haramain', style: 'Fresco' },
  { title: 'Il Mexico', brand: 'Ilmin', style: 'Elegante' },
  { title: 'Il Dolce', brand: 'Ilmin', style: 'Dulce' },
  { title: 'Il Femme', brand: 'Ilmin', style: 'Intenso' },
  { title: 'Il Kakuno', brand: 'Ilmin', style: 'Intenso' },
  { title: 'Il Orgasme', brand: 'Ilmin', style: 'Intenso' },
  { title: 'Art of Universe', brand: 'Lattafa', style: 'Fresco' },
  { title: 'Bade\'e Al Oud Amethyst', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Bade\'e Al Oud Honor & Glory', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Bade\'e Al Oud Sublime', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Khamrah Qahwa', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Santal 33', brand: 'Le Labo', style: 'Elegante' },
  { title: 'Imagination', brand: 'Louis Vuitton', style: 'Fresco' },
  { title: 'L\'Immensite', brand: 'Louis Vuitton', style: 'Fresco' },
  { title: 'Ombre Nomade', brand: 'Louis Vuitton', style: 'Intenso' },
  { title: 'Symphony', brand: 'Louis Vuitton', style: 'Fresco' },
  { title: 'Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', style: 'Dulce' },
  { title: 'Oud Maracuja', brand: 'Maison Crivelli', style: 'Intenso' },
  { title: 'Red Tobacco', brand: 'Mancera', style: 'Intenso' },
  { title: 'Arabians Tonka', brand: 'Montale', style: 'Dulce' },
  { title: 'Starry Nights', brand: 'Montale', style: 'Elegante' },
  { title: 'Hacivat', brand: 'Nishane', style: 'Fresco' },
  { title: 'Intense Cafe', brand: 'Montale', style: 'Dulce' },
  { title: 'Layton', brand: 'Parfums de Marly', style: 'Elegante' },
  { title: 'Erba Pura', brand: 'Xerjoff', style: 'Fresco' },
  { title: 'Althaïr', brand: 'Parfums de Marly', style: 'Dulce' },
  { title: 'Instant Crush', brand: 'Mancera', style: 'Dulce' },
  { title: 'Flamenco', brand: 'Ramón Monegal', style: 'Intenso' },
  { title: 'Eclaire', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Club de Nuit Milestone', brand: 'Armaf', style: 'Fresco' },
  { title: 'Sex-Sea', brand: 'Lorenzo Pazzaglia', style: 'Fresco' },
  { title: 'Sun-Gria', brand: 'Lorenzo Pazzaglia', style: 'Dulce' },
  { title: 'Black Orchid', brand: 'Tom Ford', style: 'Intenso' },
  { title: 'Neroli Portofino', brand: 'Tom Ford', style: 'Fresco' },
  { title: 'Rehab', brand: 'Initio Parfums Privés', style: 'Elegante' },
  { title: 'Herod', brand: 'Parfums de Marly', style: 'Intenso' },
  { title: 'New York Signature', brand: 'Bond No. 9', style: 'Intenso' },
  { title: 'Levar del Sole', brand: 'Xerjoff Casamorati', style: 'Dulce' },
  { title: 'Angels\' Share', brand: 'Kilian Paris', style: 'Dulce' },
  { title: 'Pacific Chill', brand: 'Louis Vuitton', style: 'Fresco' },
  { title: 'The Queen and the Viper', brand: 'Stéphane Humbert Lucas 777', style: 'Intenso' },
  { title: 'Elysium Pour Homme', brand: 'Roja Parfums', style: 'Elegante' },
  { title: 'Speachless', brand: 'Lorenzo Pazzaglia', style: 'Intenso' },
  { title: 'Costa Azzurra', brand: 'Tom Ford', style: 'Fresco' },
  // El cliente pidió agregar estas igual aunque su texto original no
  // permitía confirmar el producto exacto sin ambigüedad (marca sola, o
  // varias variantes posibles) — se usó el producto real más representativo
  // de esa marca/línea en cada caso.
  { title: 'Millésime Impérial', brand: 'Creed', style: 'Elegante' },
  { title: 'Silver Mountain Water', brand: 'Creed', style: 'Fresco' },
  { title: 'Khamrah Dukhan', brand: 'Lattafa', style: 'Dulce' },
  { title: 'Summer Hammer', brand: 'Lorenzo Pazzaglia', style: 'Fresco' },
  { title: 'Arrurrú', brand: 'Arrurrú', style: 'Dulce' },
  // Lote adicional (mismo mes) con investigación olfativa completa: el
  // cliente dio él mismo las notas de salida/corazón/fondo de cada una, así
  // que sí tienen ficha en fragranceInfo.js (a diferencia del resto de esta
  // ampliación, que solo tiene `style`).
  { title: '9 PM Rebel', brand: 'Afnan', style: 'Intenso' },
  { title: 'Hawas Fire', brand: 'Rasasi', style: 'Fresco' },
  { title: 'Club de Nuit Precieux I', brand: 'Armaf', style: 'Intenso' },
  // 2026-09-15: el cliente pidió agregar esta puntualmente a Unisex.
  // Producto real verificado (Fragrantica): amaderada-especiada, azafrán/
  // jazmín/ambarwood/ámbar gris, se posiciona como alternativa a Baccarat
  // Rouge 540 — ficha completa en fragranceInfo.js.
  { title: 'Amber Rouge', brand: 'Orientica', style: 'Intenso' },
  // 2026-10-06 (mismo lote de la lista informal del cliente, ver Caballero).
  // "Qaed Al Fursan" es la versión base (caja negra); existen Unlimited y
  // Untamed como productos aparte.
  { title: 'Qaed Al Fursan', brand: 'Lattafa', style: 'Intenso' },
  { title: 'Drunk Lovers', brand: 'Born To Stand Out', style: 'Intenso' },
  { title: 'Toxic Desire', brand: 'Korbaj', style: 'Dulce' },
].map((p) => toProduct(p, CATEGORIES.UNISEX, 'unisex'))

function slugify(...parts) {
  return parts
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Precio y presentación reales dados por el cliente (2026-09-10): $55.000
// COP en frasco de 50 ml para todo el catálogo — excepto Torino21 (Xerjoff)
// y Unstoppable Hong Kong (Elivi Parfums), que el cliente pidió dejar fuera
// del cambio (mantienen su precio/presentación anterior, sin talla fija) al
// pasar `price`/`size` explícitos en su entrada.
function toProduct({ title, brand, style, price = 55000, size = '50 ml' }, category, gender) {
  const id = slugify(title, brand, gender)
  return {
    id,
    title,
    brand,
    style,
    fullName: `${title} by ${brand}`,
    price,
    ...(size ? { sizes: [{ label: size, price }] } : {}),
    category,
    gender,
    image: PRODUCTS_WITH_OWN_PHOTO.has(id) ? id : 'catalog-bottle',
  }
}

// Se agregan nuevas cargas de catálogo haciendo spread aquí.
export const products = [...caballero, ...dama, ...caballeroAgosto2026, ...damaAgosto2026, ...unisex]

export const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'es'))

export function formatCOP(amount) {
  return `$${amount.toLocaleString('es-CO')} COP`
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function searchProducts(list, query) {
  const q = normalize(query.trim())
  if (!q) return list
  return list.filter((p) => normalize(`${p.title} ${p.brand} ${p.fullName}`).includes(q))
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null
}

// Recomienda hasta `limit` productos reales del catálogo relacionados por
// familia olfativa, marca de inspiración o género — nunca aleatorio y nunca
// fuera del catálogo real.
export function getRelatedProducts(product, limit = 4) {
  if (!product) return []
  const others = products.filter((p) => p.id !== product.id)

  // El género pesa más que estilo/marca para que nunca se recomiende un
  // producto de la sección contraria (Caballero/Dama) antes que uno real del
  // mismo género.
  const score = (p) => {
    let s = 0
    if (p.gender === product.gender) s += 4
    if (p.style && product.style && p.style === product.style) s += 2
    if (p.brand === product.brand) s += 2
    return s
  }

  return others
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p)
}
