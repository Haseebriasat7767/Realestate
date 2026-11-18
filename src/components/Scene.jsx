import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, m, useIsPresent, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import { TOWER, compactSceneQuery, imageUrl } from '../data.js'

function FloorBeacon({ floor }) {
  return (
    <m.div className="floor-beacon" initial={false} animate={{ left: `${floor.marker[0]}%`, top: `${floor.marker[1]}%` }} transition={{ type: 'tween', duration: 0.48, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
      <span className="beacon-point" />
      <span className="beacon-line" />
      <span className="beacon-caption">{floor.label}</span>
    </m.div>
  )
}

function Hotspots({ details }) {
  const [pinned, setPinned] = useState(null)
  const [peek, setPeek] = useState(null)
  const tooltipPrefix = useId()
  const anyOpen = peek !== null || pinned !== null

  useEffect(() => {
    if (!anyOpen) return
    function dismiss(event) {
      if (event.key === 'Escape') {
        setPinned(null)
        setPeek(null)
      }
    }
    window.addEventListener('keydown', dismiss)
    return () => window.removeEventListener('keydown', dismiss)
  }, [anyOpen])

  return details.map((detail, index) => {
    const tooltipId = `${tooltipPrefix}-${index}`
    const visible = (peek ?? pinned) === index
    const mobileSide = detail.compactX <= 45 ? 'left' : detail.compactX >= 54 ? 'right' : 'center'

    return (
      <div key={detail.title} className={`hotspot${visible ? ' is-open' : ''}`} data-side={mobileSide} style={{
        '--hotspot-x': `${detail.x}%`,
        '--hotspot-y': `${detail.y}%`,
        '--hotspot-compact-x': `${detail.compactX}%`,
        '--hotspot-compact-y': `${detail.compactY ?? detail.y}%`,
      }} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setPeek(index) }}
        onPointerLeave={() => setPeek((current) => current === index ? null : current)}>
        <button type="button" className="hotspot-button" aria-label={detail.title} aria-expanded={visible} aria-describedby={visible ? tooltipId : undefined}
          onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setPeek(index) }}
          onBlur={() => setPeek((current) => current === index ? null : current)}
          onClick={() => {
            setPinned(pinned === index ? null : index)
            setPeek(null)
          }}>
          <Plus size={16} strokeWidth={1.7} aria-hidden="true" />
        </button>
        <div className="hotspot-tooltip" id={tooltipId} role="tooltip" aria-hidden={!visible}>
          <strong>{detail.title}</strong>
          <span>{detail.description}</span>
        </div>
      </div>
    )
  })
}

function SceneShot({ room, isTour, entering, floor, pan, reduceMotion }) {
  const isPresent = useIsPresent()
  const useBeacon = !isTour && !entering && isPresent
  const hasPanel = isTour && isPresent
  const flyIn = entering && !reduceMotion

  return (
    <m.div className={`scene-shot ${isTour ? 'scene-shot--room' : 'scene-shot--tower'}`}
      data-present={isPresent}
      id={hasPanel ? 'tour-view' : undefined}
      role={hasPanel ? 'tabpanel' : undefined}
      aria-labelledby={hasPanel ? `room-tab-${room.id}` : undefined}
      aria-hidden={!isPresent ? true : undefined}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.16 : 0.58, ease: 'easeInOut' }}>
      <m.div className="scene-flight" style={{ '--flight-y': `${floor.marker[1]}%` }} initial={false}
        animate={isTour ? { scale: 1 } : { scale: flyIn ? 1.8 : 1, filter: flyIn ? 'blur(8px)' : 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.55, 0.08, 0.3, 1] }}>
        <m.div className="scene-pan" style={{ x: pan }}>
          <div className="scene-frame">
            <picture>
              <source media={compactSceneQuery} srcSet={imageUrl(`${room.id}-compact`)} />
              <img src={imageUrl(room.id)} alt={isPresent ? room.alt : ''} width="1672" height="941" fetchPriority={isTour ? 'auto' : 'high'} draggable="false" />
            </picture>
            {useBeacon && <FloorBeacon floor={floor} />}
            {hasPanel && <Hotspots details={room.details} />}
          </div>
        </m.div>
      </m.div>
      <div className="scene-shade" aria-hidden="true" />
    </m.div>
  )
}

export default function Scene({ mode, room, floor }) {
  const isTour = mode === 'tour'
  const entering = mode === 'entering'
  const reduceMotion = useReducedMotion()
  const panTarget = useMotionValue(0)
  const sprungPan = useSpring(panTarget, { stiffness: 220, damping: 30, mass: 0.6 })
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    panTarget.set(0)
    drag.current = null
    setDragging(false)
  }, [mode, room.id, panTarget])

  function startDrag(event) {
    if (entering || !event.isPrimary || event.button !== 0 || event.target.closest('.hotspot')) return
    drag.current = { id: event.pointerId, start: event.clientX, origin: panTarget.get(), active: false }
  }

  function moveDrag(event) {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId || entering) return
    const delta = event.clientX - gesture.start
    if (!gesture.active) {
      if (Math.abs(delta) < 5) return
      gesture.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    const { clientWidth, clientHeight } = event.currentTarget
    const frameWidth = Math.max(clientWidth, clientHeight * (16 / 9))
    const limit = Math.min(isTour ? 58 : 38, frameWidth * (isTour ? 0.035 : 0.015))
    panTarget.set(Math.max(-limit, Math.min(limit, gesture.origin + delta * 0.48)))
  }

  function finishDrag(event) {
    if (drag.current?.id !== event.pointerId) return
    drag.current = null
    setDragging(false)
  }

  return (
    <div className="scene" data-dragging={dragging} data-entering={entering}
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={(event) => {
        // Touch starts with implicit capture on a child; only end when the scene loses capture.
        if (event.target === event.currentTarget) finishDrag(event)
      }}
      onPointerLeave={(event) => { if (!drag.current?.active) finishDrag(event) }}>
      <AnimatePresence initial={false}>
        <SceneShot key={isTour ? `room-${room.id}` : 'tower-approach'} room={isTour ? room : TOWER}
          isTour={isTour} entering={entering} floor={floor} pan={reduceMotion ? panTarget : sprungPan} reduceMotion={reduceMotion} />
      </AnimatePresence>
    </div>
  )
}
