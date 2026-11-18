import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'framer-motion'
import Experience from './components/Experience.jsx'
import { SiteFooter } from './components/Chrome.jsx'
import { Amenities, Enquire, Location, Residences } from './components/Sections.jsx'
import { DEFAULT_FLOOR, FLOORS, ROOMS, warmScene } from './data.js'

export default function App() {
  const [mode, setMode] = useState('tower')
  const [floorId, setFloorId] = useState(DEFAULT_FLOOR)
  const [roomIndex, setRoomIndex] = useState(0)
  const stageRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const floor = FLOORS.find((item) => item.id === floorId)

  useLayoutEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1))
    target?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (navigator.connection?.saveData) return
    const idleTimer = window.setTimeout(() => warmScene('living'), 1300)
    return () => window.clearTimeout(idleTimer)
  }, [])

  useEffect(() => {
    if (mode !== 'entering') return
    let cancelled = false
    let minTimer
    let maxTimer
    // Keep the approach visible for at least 800 ms, but never stall the tour on a slow image.
    const minimum = new Promise((resolve) => { minTimer = window.setTimeout(resolve, 800) })
    const deadline = new Promise((resolve) => { maxTimer = window.setTimeout(resolve, 2000) })
    Promise.race([Promise.all([minimum, warmScene('living')]), deadline]).then(() => {
      if (!cancelled) setMode('tour')
    })
    return () => {
      cancelled = true
      window.clearTimeout(minTimer)
      window.clearTimeout(maxTimer)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'tour' || navigator.connection?.saveData) return
    ROOMS.slice(1).forEach((room) => warmScene(room.id))
  }, [mode])

  function showExperience() {
    stageRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function enterResidence(id) {
    setFloorId(id)
    setRoomIndex(0)
    if (mode === 'tower') setMode('entering')
    showExperience()
  }

  function returnToTower() {
    setMode('tower')
    setRoomIndex(0)
    showExperience()
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a className="skip-link" href="#residences">Skip to residences</a>
        <main>
          <Experience stageRef={stageRef} mode={mode} floor={floor} roomIndex={roomIndex} onSelect={setFloorId} onRoom={setRoomIndex}
            onEnter={enterResidence} onBack={returnToTower} />
          <Residences onTour={enterResidence} />
          <Amenities />
          <Location />
          <Enquire floor={floor} />
        </main>
        <SiteFooter onHome={returnToTower} />
      </LazyMotion>
    </MotionConfig>
  )
}
