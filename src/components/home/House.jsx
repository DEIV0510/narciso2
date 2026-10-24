import { useRef, useState } from 'react'
import { IconPlay } from '../Icons'
import { brand, houseFacts } from '../../data/site'
import craftPosterAvif from '../../assets/img/craft-poster.avif'
import craftPosterWebp from '../../assets/img/craft-poster.webp'
import craftPosterJpg from '../../assets/img/craft-poster.jpg'
import craftVideo from '../../assets/video/craft-process.mp4'
import labelAvif from '../../assets/img/label-detail.avif'
import labelWebp from '../../assets/img/label-detail.webp'
import labelJpg from '../../assets/img/label-detail.jpg'
import './House.css'

// Video real del proceso (medir, mezclar y envasar) — carga solo al pulsar.
function CraftVideo() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  // El botón desaparece al reproducir: el foco pasa al reproductor.
  const play = () => {
    setPlaying(true)
    requestAnimationFrame(() => {
      const v = videoRef.current
      if (!v) return
      v.focus()
      v.play().catch(() => {})
    })
  }
  return (
    <div className="house__video curtain" data-reveal>
      {/* Alternativa en texto de lo que solo se ve en el video. */}
      <p id="craft-video-desc" className="sr-only">
        Video de 50 segundos con música y sin narración: se pesa la esencia en una balanza digital, se mezcla con una
        varilla, se envasa en un frasco Narciso esmerilado, se le pone la tapa negra y dorada y termina con el logo de
        Narciso Parfum.
      </p>
      {playing ? (
        <video
          ref={videoRef}
          src={craftVideo}
          poster={craftPosterJpg}
          controls
          playsInline
          preload="auto"
          width="720"
          height="1280"
          tabIndex={0}
          aria-label="Video del proceso de elaboración"
          aria-describedby="craft-video-desc"
        >
          Tu navegador no reproduce video.
        </video>
      ) : (
        <button type="button" className="house__play" onClick={play} aria-describedby="craft-video-desc">
          <picture>
            <source type="image/avif" srcSet={craftPosterAvif} />
            <source type="image/webp" srcSet={craftPosterWebp} />
            <img src={craftPosterJpg} alt="" width="720" height="1280" loading="lazy" decoding="async" />
          </picture>
          <span className="house__play-btn" aria-hidden="true">
            <IconPlay />
          </span>
          <span className="house__play-label">
            El proceso <span aria-hidden="true">·</span> Ver video<span className="sr-only"> de la elaboración</span>
          </span>
        </button>
      )}
    </div>
  )
}

export default function House() {
  return (
    <section id="la-casa" className="section theme-ivory grain house" aria-labelledby="house-title">
      <div className="wrap house__grid">
        <div className="house__media">
          <CraftVideo />
          <picture className="house__label curtain" data-reveal style={{ '--d': 3 }}>
            <source type="image/avif" srcSet={labelAvif} />
            <source type="image/webp" srcSet={labelWebp} />
            <img
              src={labelJpg}
              alt="Detalle de la etiqueta del frasco: Narciso Parfum, Eau de parfum, especialistas en inspiración, elaborado en Ibagué Tolima"
              width="599"
              height="599"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className="house__copy">
          <p className="eyebrow" data-reveal>
            La casa
          </p>
          <h2 id="house-title" className="display h-xl" data-reveal style={{ '--d': 1 }}>
            Especialistas en <em className="gold-ink">inspiración</em>
          </h2>
          <p className="lead" data-reveal style={{ '--d': 2 }}>
            Cada fragancia de Narciso Parfum se inspira en un perfume icónico y respeta su pirámide olfativa: salida,
            corazón y fondo. La medimos, la mezclamos y la envasamos en Ibagué, en nuestro frasco negro mate con tapa
            dorada.
          </p>

          <ol className="house__facts" role="list">
            {houseFacts.map((f, i) => (
              <li key={f.title} data-reveal style={{ '--d': i + 2 }}>
                <span className="house__n tabular">0{i + 1}</span>
                <span>
                  <strong>{f.title}</strong>
                  {f.text}
                </span>
              </li>
            ))}
          </ol>

          <blockquote className="house__quote display" data-reveal>
            “{brand.taglines.attitude}.”
          </blockquote>
        </div>
      </div>
    </section>
  )
}
