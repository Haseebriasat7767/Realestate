import { useEffect, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BedDouble, Compass, Layers3, MapPin, Mouse, Ruler, Tag } from 'lucide-react'
import { FLOORS, ROOMS, warmScene } from '../data.js'
import { Eyebrow, SiteHeader } from './Chrome.jsx'
import Scene from './Scene.jsx'

const softOut = [0.22, 1, 0.36, 1]

function FloorSelector({ floor, onSelect, onEnter }) {
  const reduceMotion = useReducedMotion()
  const stats = [
    { Icon: BedDouble, label: `${floor.beds} Bed` },
    { Icon: Ruler, label: `${floor.area} sq.ft` },
    { Icon: Tag, label: floor.price },
  ]
  const slideIn = { opacity: 0, y: reduceMotion ? 0 : 7 }
  const slideOut = { opacity: 0, y: reduceMotion ? 0 : -7 }
  const shown = { opacity: 1, y: 0 }

  function navigateFloors(event) {
    const current = FLOORS.findIndex(({ id }) => id === event.target.dataset.floor)
    if (current < 0) return
    const steps = { ArrowUp: current - 1, ArrowDown: current + 1, Home: 0, End: FLOORS.length - 1 }
    if (!(event.key in steps)) return
    event.preventDefault()
    const next = FLOORS[(steps[event.key] + FLOORS.length) % FLOORS.length]
    onSelect(next.id)
    event.currentTarget.querySelector(`[data-floor="${next.id}"]`)?.focus()
  }

  return (
    <aside className="floor-selector" aria-labelledby="floor-selector-heading">
      <div className="floor-selector-top">
        <p className="card-kicker micro flex items-center"><Layers3 size={14} strokeWidth={1.5} aria-hidden="true" /> Virtual Residence Tour</p>
        <h2 id="floor-selector-heading">Choose Your Floor</h2>
      </div>
      <div className="floor-dial">
        <div className="floor-rail" role="group" aria-label="Available floors" onKeyDown={navigateFloors}>
          {FLOORS.map((item) => (
            <button type="button" key={item.id} className="floor-stop" aria-pressed={item.id === floor.id} data-floor={item.id} onClick={() => onSelect(item.id)}>
              <span className="floor-stop-dot" aria-hidden="true" />
              <span>{item.button}</span>
            </button>
          ))}
        </div>
        <div className="floor-active" aria-hidden="true">
          <span className="micro active-caption">Selected Level</span>
          <div className="floor-number-slot">
            <AnimatePresence initial={false}>
              <m.div key={floor.id} className="floor-numeral" initial={slideIn} animate={shown} exit={slideOut} transition={{ duration: 0.3, ease: softOut }}>{floor.numeral}</m.div>
            </AnimatePresence>
          </div>
          <div className="floor-view-slot">
            <AnimatePresence initial={false}>
              <m.div key={floor.id} className="floor-view" initial={slideIn} animate={shown} exit={slideOut} transition={{ duration: 0.3, ease: softOut }}>{floor.view}</m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="floor-stats-slot" aria-hidden="true">
        <AnimatePresence initial={false}>
          <m.div key={floor.id} className="floor-stats" initial={slideIn} animate={shown} exit={slideOut} transition={{ duration: 0.3, ease: softOut }}>
            {stats.map(({ Icon, label }) => (
              <span key={label}><Icon size={16} strokeWidth={1.5} />{label}</span>
            ))}
          </m.div>
        </AnimatePresence>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{floor.label}: {floor.beds} bedrooms, {floor.area} square feet, {floor.price}, {floor.view}.</span>
      <button type="button" className="button button-blue enter-button" onPointerEnter={() => warmScene('living')} onFocus={() => warmScene('living')} onClick={() => onEnter(floor.id)}>
        Enter Residence <ArrowRight size={17} strokeWidth={1.65} aria-hidden="true" />
      </button>
    </aside>
  )
}

function ExteriorCopy({ headingRef }) {
  return (
    <div className="exterior-copy">
      <Eyebrow>The Marina Collection</Eyebrow>
      <h1 className="hero-title" id="exterior-heading" tabIndex={-1} ref={headingRef}>
        Aurelia <em>Tower</em>
      </h1>
      <p className="hero-description">A collection of extraordinary waterfront homes, rising above a private marina.</p>
      <a className="hero-text-link" href="#residences">
        Explore Residences <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
      </a>
    </div>
  )
}

function ExteriorRail() {
  return (
    <div className="exterior-rail site-width">
      <a className="rail-location micro" href="#location"><MapPin size={15} strokeWidth={1.55} aria-hidden="true" /> Marina District</a>
      <a className="rail-explore" href="#residences"><Mouse size={17} strokeWidth={1.55} aria-hidden="true" /> Scroll / Drag to Explore <ArrowDown size={13} strokeWidth={1.6} aria-hidden="true" /></a>
      <span className="rail-index micro"><b>01</b><span /> Exterior View</span>
    </div>
  )
}

function TourDock({ roomIndex, floor, onRoom, headingRef }) {
  const room = ROOMS[roomIndex]
  const tabs = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const list = tabs.current
    const current = list.children[roomIndex]
    const viewport = list.getBoundingClientRect()
    const button = current.getBoundingClientRect()
    if (button.left < viewport.left + 4 || button.right > viewport.right - 4) {
      list.scrollBy({ left: button.left - viewport.left - 4, behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }, [roomIndex, reduceMotion])

  function navigateTabs(event) {
    const keys = { ArrowLeft: roomIndex - 1, ArrowRight: roomIndex + 1, Home: 0, End: ROOMS.length - 1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = (keys[event.key] + ROOMS.length) % ROOMS.length
    onRoom(next)
    tabs.current.children[next]?.focus({ preventScroll: true })
  }

  return (
    <div className="tour-dock site-width">
      <div className="room-label">
        <p className="micro flex items-center"><Compass size={14} strokeWidth={1.5} aria-hidden="true" /> Residence Tour</p>
        <h2 tabIndex={-1} id="tour-heading" aria-live="polite" ref={headingRef}>{room.name} <span>— {floor.label}</span></h2>
      </div>
      <div className="room-tabs" ref={tabs} role="tablist" aria-label="Room views" onKeyDown={navigateTabs}>
        {ROOMS.map(({ id, name }, index) => (
          <button type="button" key={id} id={`room-tab-${id}`} role="tab" tabIndex={index === roomIndex ? 0 : -1} aria-selected={index === roomIndex}
            aria-controls="tour-view" onClick={() => onRoom(index)} onPointerEnter={() => warmScene(id)}>{name}</button>
        ))}
      </div>
      <div className="tour-arrows flex items-center">
        <button type="button" className="round-button" aria-label="Previous room" onClick={() => onRoom((roomIndex - 1 + ROOMS.length) % ROOMS.length)}><ArrowLeft size={19} strokeWidth={1.6} aria-hidden="true" /></button>
        <button type="button" className="round-button" aria-label="Next room" onClick={() => onRoom((roomIndex + 1) % ROOMS.length)}><ArrowRight size={19} strokeWidth={1.6} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

export default function Experience({ stageRef, mode, floor, roomIndex, onSelect, onEnter, onRoom, onBack }) {
  const inside = mode === 'tour'
  const entering = mode === 'entering'
  const exteriorHeading = useRef(null)
  const tourHeading = useRef(null)
  const hasLeftTower = useRef(false)
  const reduceMotion = useReducedMotion()
  const fadesOut = { opacity: entering ? 0 : 1, y: entering && !reduceMotion ? 9 : 0 }

  useEffect(() => {
    if (mode !== 'tower') hasLeftTower.current = true
    if (mode === 'tour') tourHeading.current?.focus({ preventScroll: true })
    if (mode === 'tower' && hasLeftTower.current) exteriorHeading.current?.focus({ preventScroll: true })
  }, [mode])

  return (
    <section id="home" className={`experience${inside ? ' experience--tour' : ''}`} aria-labelledby={inside ? 'tour-heading' : 'exterior-heading'} ref={stageRef}>
      <Scene mode={mode} room={ROOMS[roomIndex]} floor={floor} />
      <SiteHeader isInside={mode !== 'tower'} onBack={onBack} />
      {inside ? (
        <div className="tour-controls">
          <m.p className="tour-drag-hint micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Mouse size={14} strokeWidth={1.6} aria-hidden="true" /> Drag to Look Around
          </m.p>
          <TourDock roomIndex={roomIndex} floor={floor} onRoom={onRoom} headingRef={tourHeading} />
        </div>
      ) : (
        <>
          <m.div className="exterior-content site-width" animate={fadesOut} transition={{ duration: 0.24 }} inert={entering || undefined}>
            <ExteriorCopy headingRef={exteriorHeading} />
            <FloorSelector floor={floor} onSelect={onSelect} onEnter={onEnter} />
          </m.div>
          <m.div className="exterior-rail-wrap" animate={fadesOut} transition={{ duration: 0.24 }} inert={entering || undefined}>
            <ExteriorRail />
          </m.div>
        </>
      )}
      <AnimatePresence>
        {entering && (
          <m.div className="approach-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.12 : 0.29 }}>
            <div className="approach-label" role="status">
              <span className="micro">Aurelia Residence Tour</span>
              <p>Entering {floor.label}...</p>
              <span className="approach-progress" aria-hidden="true" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
