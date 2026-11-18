import { useEffect, useRef, useState } from 'react'
import { Anchor, ArrowRight, ArrowUpRight, Bath, BedDouble, Check, ChevronDown, Flower2, MapPin, Ruler, Sunset, Waves } from 'lucide-react'
import { FLOORS, RESIDENCES, imageUrl, warmScene } from '../data.js'
import { Eyebrow } from './Chrome.jsx'

function ResidenceCard({ residence, onTour }) {
  const floor = FLOORS.find((item) => item.id === residence.floorId)
  const stats = [
    { Icon: BedDouble, label: `${floor.beds} Beds` },
    { Icon: Bath, label: `${floor.baths} Baths` },
    { Icon: Ruler, label: `${floor.area} sq.ft` },
  ]

  return (
    <article className="residence-card">
      <div className="residence-image">
        <img src={imageUrl(residence.image)} alt={residence.alt} loading="lazy" decoding="async" />
        <span className="residence-badge micro">{floor.label}</span>
      </div>
      <div className="residence-body">
        <h3>{residence.title}</h3>
        <p className="residence-outlook">{floor.view}</p>
        <ul className="residence-specs flex flex-wrap">
          {stats.map(({ Icon, label }) => <li className="flex items-center" key={label}><Icon size={17} strokeWidth={1.45} aria-hidden="true" /> {label}</li>)}
        </ul>
        <div className="residence-action flex items-center justify-between">
          <p className="residence-price"><span className="micro">From</span><strong>{floor.price}</strong></p>
          <button type="button" className="button button-outline property-cta" onPointerEnter={() => warmScene('living')} onClick={() => onTour(floor.id)} aria-label={`View Tour: ${residence.title}`}>
            View Tour <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function Residences({ onTour }) {
  return (
    <section className="section-pad residences-section" id="residences" aria-labelledby="residences-heading">
      <div className="site-width">
        <div className="collection-intro flex flex-wrap items-end justify-between">
          <div>
            <Eyebrow>01 / The Collection</Eyebrow>
            <h2 className="section-title" id="residences-heading">Choose Your <em>Residence</em></h2>
          </div>
          <p>From garden-level retreats to the penthouse above the marina, find a home with the view you want to wake up to.</p>
        </div>
        <div className="residence-grid grid">
          {RESIDENCES.map((residence) => <ResidenceCard residence={residence} key={residence.floorId} onTour={onTour} />)}
        </div>
      </div>
    </section>
  )
}

const AMENITIES = [
  { Icon: Waves, name: 'Infinity Pool', detail: 'A horizon-edge pool overlooking the marina.' },
  { Icon: Anchor, name: 'Private Marina', detail: 'Residents-only berths just steps from home.' },
  { Icon: Flower2, name: 'Spa & Wellness', detail: 'Treatment rooms, a sauna and space to unwind.' },
  { Icon: Sunset, name: 'Sky Lounge', detail: 'An elevated lounge for sunset and late evenings.' },
]

export function Amenities() {
  return (
    <section className="section-pad amenities-section" id="amenities" aria-labelledby="amenities-heading">
      <div className="site-width amenities-layout grid">
        <div className="amenities-copy">
          <Eyebrow>02 / The Lifestyle</Eyebrow>
          <h2 className="section-title" id="amenities-heading">Life on <em>the Waterfront</em></h2>
          <p>Take the boat out from your own berth, spend an afternoon at the spa, or watch the marina lights come on from the sky lounge.</p>
          <ul className="amenity-grid grid">
            {AMENITIES.map(({ Icon, name, detail }) => (
              <li className="amenity" key={name}>
                <Icon size={24} strokeWidth={1.35} aria-hidden="true" />
                <h3>{name}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <figure className="amenity-figure">
          <img src={imageUrl('infinity-terrace')} alt="An infinity pool on a softly lit seaside terrace at twilight." fetchPriority="low" decoding="async" />
          <figcaption className="micro"><span /> The Infinity Terrace</figcaption>
        </figure>
      </div>
    </section>
  )
}

function MarinaMap() {
  return (
    <figure className="marina-map">
      <svg viewBox="0 0 640 368" role="img" aria-labelledby="marina-map-title" xmlns="http://www.w3.org/2000/svg">
        <title id="marina-map-title">Illustrative map showing Aurelia Tower between the harbour gardens, promenade and private marina</title>
        <defs>
          <linearGradient id="sea-tone" x1="0" x2="1" y2="1">
            <stop stopColor="#172638" /><stop offset="1" stopColor="#0e1b28" />
          </linearGradient>
          <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="#a3bad1" strokeOpacity=".13" strokeWidth="1" /></pattern>
          <pattern id="land-grid" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><path d="M0 0V9" stroke="#a6afae" strokeOpacity=".1" /></pattern>
          <path id="marina-land" d="M0 0H475c-14 33-87 57-115 90-27 32-8 61-34 97-27 38-81 53-130 76-48 24-56 58-69 105H0Z" />
        </defs>
        <rect width="640" height="368" fill="url(#sea-tone)" />
        <rect width="640" height="368" fill="url(#map-grid)" />
        <use href="#marina-land" fill="#202934" stroke="#b1a283" strokeOpacity=".55" strokeWidth="1.35" />
        <use href="#marina-land" fill="url(#land-grid)" />
        <g fill="none" stroke="#a2b6c8" strokeOpacity=".17" strokeWidth="1.2">
          <path d="M0 22h203l58-22M0 88h206c49 0 100-43 174-43M0 156h215c38 0 86-47 108-59M0 224h153c55 0 76-43 119-55M0 294h116M0 343h104" />
          <path d="M53 0v368M125 0v256M198 0v155m60-74V0M70 121h105m-106 71h112" />
          <path d="M467 91c-85 52-42 92-77 145-35 53-137 42-155 132m272-251c-71 44-35 88-65 131-28 39-106 49-135 120m239-217c-52 48-30 72-67 118-24 31-68 52-88 99" />
        </g>
        <path d="M0 276H114c64 0 74-38 137-57 55-17 83-37 87-80 3-25 0-37 25-67" fill="none" stroke="#d1b480" strokeDasharray="4 6" strokeOpacity=".64" strokeWidth="1.5" />
        <g fill="none" stroke="#b4aa98" strokeOpacity=".56" strokeWidth="1.5">
          <path d="m349 130 78 25m-85 3 79 26m-94 5 79 25m-106 0 68 36m-100-20 50 36" />
          <path d="m381 141-5 14m22-9-5 14m-20 8-5 14m22-8-5 14m-19 13-5 13m24-8-5 14m-29 16-8 12m-14-23-7 12" />
        </g>
        <g fill="#9dabb9" fontFamily="Inter Variable, sans-serif" fontSize="9.7" letterSpacing="1.7">
          <text x="81" y="126">HARBOUR GARDENS</text>
          <text x="91" y="254">PROMENADE</text>
          <text x="415" y="252">PRIVATE MARINA</text>
          <text x="500" y="112" fill="#7c91a6">OPEN WATER</text>
        </g>
        <g fill="none" stroke="#d4b476">
          <circle cx="315" cy="194" r="24" strokeOpacity=".18" /><circle cx="315" cy="194" r="15" strokeOpacity=".4" /><circle cx="315" cy="194" r="7" fill="#e7c58a" strokeWidth="1" />
          <path d="M322 190l20-31h14" strokeWidth="1.1" />
        </g>
        <rect x="353" y="145" width="124" height="27" rx="4" fill="#182434" stroke="#d4b476" strokeOpacity=".5" />
        <text x="415" y="162" fill="#f1d5a4" fontFamily="Inter Variable, sans-serif" fontSize="9.5" textAnchor="middle" letterSpacing="1.6">AURELIA TOWER</text>
        <path d="M578 63V33m-5 7 5-7 5 7m-14 14h18" fill="none" stroke="#b1a283" strokeOpacity=".8" strokeWidth="1.2" />
        <text x="578" y="25" fill="#c9b48f" fontFamily="Inter Variable, sans-serif" fontSize="9" textAnchor="middle">N</text>
      </svg>
      <figcaption className="micro"><span>Marina District</span><span>Illustrative map · Not to scale</span></figcaption>
    </figure>
  )
}

export function Location() {
  return (
    <section className="section-pad location-section" id="location" aria-labelledby="location-heading">
      <div className="site-width location-layout grid items-center">
        <div>
          <Eyebrow>03 / The Address</Eyebrow>
          <h2 className="section-title" id="location-heading">The Marina <em>District</em></h2>
          <p className="section-description">Between the harbour gardens and the open sea, Aurelia sits right on the promenade. Walk to the marina and waterfront dining without leaving the neighbourhood.</p>
          <a className="location-link flex items-center" href="#contact"><MapPin size={17} strokeWidth={1.55} aria-hidden="true" /> Arrange a visit <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <MarinaMap />
      </div>
    </section>
  )
}

export function Enquire({ floor }) {
  const [interest, setInterest] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const confirmation = useRef(null)

  useEffect(() => {
    if (submitted) confirmation.current?.focus({ preventScroll: true })
  }, [submitted])

  function submitEnquiry(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="section-pad enquiry-section" id="contact" aria-labelledby="contact-heading">
      <div className="site-width enquiry-layout grid items-center">
        <div>
          <Eyebrow>04 / By Appointment</Eyebrow>
          <h2 className="section-title" id="contact-heading">Book a <em>Private Tour</em></h2>
          <p className="section-description">Visit Aurelia Tower and see the residences at your own pace. Let us know which floor you’d like to explore.</p>
        </div>
        {submitted ? (
          <div className="enquiry-card enquiry-success" role="status" tabIndex={-1} ref={confirmation}>
            <span className="success-icon"><Check size={22} strokeWidth={1.7} aria-hidden="true" /></span>
            <p>Thank you! Our team will contact you.</p>
            <span>This is a fictional development. Your details were not sent.</span>
            <button type="button" className="text-action" onClick={() => setSubmitted(false)}>Start another enquiry <ArrowRight size={14} aria-hidden="true" /></button>
          </div>
        ) : (
          <form className="enquiry-card enquiry-form grid" onSubmit={submitEnquiry}>
            <div className="form-field">
              <label htmlFor="enquiry-name">Name</label>
              <input id="enquiry-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} />
            </div>
            <div className="form-field">
              <label htmlFor="enquiry-email">Email</label>
              <input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={160} />
            </div>
            <div className="form-field">
              <label htmlFor="enquiry-phone">Phone</label>
              <input id="enquiry-phone" name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" minLength={7} maxLength={26} required />
            </div>
            <div className="form-field">
              <label htmlFor="enquiry-floor">Interested Floor</label>
              <span className="select-wrap">
                <select id="enquiry-floor" name="floor" value={interest ?? floor.id} onChange={(event) => setInterest(event.target.value)} required>
                  {FLOORS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </div>
            <button className="button button-blue enquiry-submit" type="submit">Request Call Back <ArrowRight size={17} strokeWidth={1.65} aria-hidden="true" /></button>
          </form>
        )}
      </div>
    </section>
  )
}
