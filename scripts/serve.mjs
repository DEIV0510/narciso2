// Servidor estático para probar dist/ con las mismas reglas que producción
// (.htaccess / vercel.json): URLs limpias, /ruta -> ruta.html o ruta/index.html,
// 404.html para lo demás. Sin dependencias.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT || 5275)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
}

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/'
  const base = path.join(DIST, clean)
  if (!base.startsWith(DIST)) return null
  const candidates = [base, path.join(base, 'index.html'), `${base}.html`]
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null
}

http
  .createServer((req, res) => {
    const file = resolve(req.url)
    const status = file ? 200 : 404
    const target = file || path.join(DIST, '404.html')
    const type = TYPES[path.extname(target)] || 'application/octet-stream'
    const stat = fs.statSync(target)
    const range = req.headers.range
    if (range && type === 'video/mp4') {
      const [s, e] = range.replace('bytes=', '').split('-')
      const start = Number(s)
      const end = e ? Number(e) : stat.size - 1
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      })
      fs.createReadStream(target, { start, end }).pipe(res)
      return
    }
    res.writeHead(status, { 'Content-Type': type, 'Content-Length': stat.size })
    fs.createReadStream(target).pipe(res)
  })
  .listen(PORT, () => console.log(`dist en http://localhost:${PORT}`))
