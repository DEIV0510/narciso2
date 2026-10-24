import { Component } from 'react'
import { waLink, waMessages } from '../data/site'

// Red de seguridad: un error inesperado de render o de un efecto ya no deja la
// página en blanco. Sin error devuelve los hijos tal cual (la hidratación no
// cambia). Los enlaces son <a> normales para recargar del todo aunque el fallo
// venga del router.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Narciso Parfum: error inesperado', error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="crash wrap" role="alert">
        <p className="eyebrow">Narciso Parfum</p>
        <h1 className="display h-lg">Algo no cargó bien</h1>
        <p>Recarga la página o vuelve al catálogo. Si el problema sigue, escríbenos y te atendemos por WhatsApp.</p>
        <div className="crash__actions">
          <a className="btn" href="/perfumes">
            Ver las fragancias
          </a>
          <a className="btn btn--ghost" href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    )
  }
}
