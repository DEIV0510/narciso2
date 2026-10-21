import { Link } from 'react-router-dom'
import { Emblem } from '../components/Logo'
import { IconArrow } from '../components/Icons'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <section className="nf grain" aria-labelledby="nf-title">
      <div className="wrap nf__inner">
        <Emblem size={72} />
        <p className="eyebrow eyebrow--plain">Error 404</p>
        <h1 id="nf-title" className="display h-xl">
          Esta esencia <em className="gold-ink">se evaporó</em>
        </h1>
        <p className="lead">La página que buscas no existe o cambió de dirección. Las fragancias siguen aquí.</p>
        <div className="nf__ctas">
          <Link to="/perfumes" className="btn">
            Ver fragancias <IconArrow />
          </Link>
          <Link to="/" className="btn btn--ghost">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
