import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data.js'

export function Brand({ onClick }) {
  return (
    <a href="#home" className="brand" aria-label="Aurelia Marina Residences, home" onClick={onClick}>
      <svg className="brand-mark" width="35" height="38" viewBox="0 0 35 38" fill="none" aria-hidden="true">
        <path d="M17.5 3 3 30h29L17.5 3Zm0 8.5L8.3 30m9.2-18.5L26.7 30m-9.2-10v10M7.5 25h20M3 33.5h29" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="brand-wordmark">
        <span>Aurelia</span>
        <small>Marina Residences</small>
      </span>
    </a>
  )
}

export function SiteHeader({ isInside, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const closeOnOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('pointerdown', closeOnOutside)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('pointerdown', closeOnOutside)
    }
  }, [menuOpen])

  function goHome() {
    setMenuOpen(false)
    onBack()
  }

  return (
    <header className="masthead" ref={headerRef}>
      <div className="masthead-inner site-width">
        <Brand onClick={goHome} />
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={id === 'home' ? goHome : () => setMenuOpen(false)} aria-current={id === 'home' ? 'location' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="masthead-actions flex items-center">
          {isInside ? (
            <button type="button" className="button button-glass header-cta" onClick={goHome}>
              <ArrowLeft size={15} aria-hidden="true" /> Back to Tower
            </button>
          ) : (
            <a className="button button-blue header-cta" href="#contact" onClick={() => setMenuOpen(false)}>
              Enquire Now <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <button ref={menuButton} type="button" className="menu-toggle" aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

export function SiteFooter({ onHome }) {
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-main flex flex-wrap items-center justify-between">
          <Brand onClick={onHome} />
          <nav className="flex flex-wrap items-center" aria-label="Footer navigation">
            {NAV_LINKS.slice(1).map(({ id, label }) => <a href={`#${id}`} key={id}>{label}</a>)}
          </nav>
        </div>
        <div className="footer-note flex flex-wrap justify-between">
          <span>© {new Date().getFullYear()} Aurelia Tower</span>
          <span>A fictional development. All images are artist impressions.</span>
        </div>
      </div>
    </footer>
  )
}
