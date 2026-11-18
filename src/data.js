export const FLOORS = [
  { id: '8', numeral: '08', button: 'Floor 8', label: 'Level 8', beds: 2, baths: 2, area: '1,250', price: '$450K', view: 'Garden View', marker: [56, 69] },
  { id: '16', numeral: '16', button: 'Floor 16', label: 'Level 16', beds: 3, baths: 3, area: '1,850', price: '$780K', view: 'Sea View', marker: [55.8, 57] },
  { id: '24', numeral: '24', button: 'Floor 24', label: 'Level 24', beds: 3, baths: 3, area: '2,100', price: '$950K', view: 'Panoramic Sea View', marker: [55.5, 45] },
  { id: '32', numeral: '32', button: 'Floor 32', label: 'Level 32', beds: 4, baths: 4, area: '2,800', price: '$1.4M', view: 'Full Marina View', marker: [55, 33] },
  { id: 'penthouse', numeral: 'PH', button: 'Penthouse', label: 'Penthouse', beds: 5, baths: 5, area: '4,500', price: '$3.2M', view: '360° Sky View', marker: [53.6, 16] },
]

export const DEFAULT_FLOOR = '16'
export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'residences', label: 'Residences' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'contact', label: 'Contact' },
]

const TOWER_ALT = 'A slender, curved tower with illuminated balconies rises above a yacht marina at sunset.'

export const ROOMS = [
  {
    id: 'living', name: 'Living Room', alt: 'A navy velvet sofa, handblown chandelier and marble table beside full-height windows overlooking the sea.',
    details: [
      { title: 'Handblown Glass', description: 'Amber pendants suspended from a warm timber ceiling.', x: 33, y: 24, compactX: 41 },
      { title: 'Italian Marble', description: 'Naturally veined stone, selected for each residence.', x: 49, y: 76, compactX: 47 },
      { title: 'Floor-to-Ceiling Glass', description: 'Full-height glazing opens the room to the horizon.', x: 73, y: 44, compactX: 58 },
    ],
  },
  {
    id: 'bedroom', name: 'Bedroom', alt: 'A king bed in warm ivory linen with walnut paneling and tall corner windows overlooking the waterfront.',
    details: [
      { title: 'Smart Home', description: 'Set your lighting and shades from a single scene control.', x: 35, y: 47, compactX: 41 },
      { title: 'King Suite', description: 'Soft linens and warm walnut create a quiet retreat.', x: 43, y: 68, compactX: 45 },
      { title: 'Corner Glazing', description: 'Curved glass brings the waterfront into the room.', x: 67, y: 34, compactX: 58 },
    ],
  },
  {
    id: 'bathroom', name: 'Bathroom', alt: 'An oval white soaking tub and Italian marble finishes framed by windows overlooking the marina.',
    details: [
      { title: 'Italian Marble', description: 'Honed stone and warm bronze fixtures.', x: 36, y: 44, compactX: 42 },
      { title: 'Soaking Tub', description: 'A freestanding bath set directly against the sea view.', x: 64, y: 73, compactX: 54 },
      { title: 'Marina Outlook', description: 'Watch the harbour lights come on from above.', x: 76, y: 48, compactX: 59 },
    ],
  },
  {
    id: 'tower', name: 'Exterior', alt: TOWER_ALT,
    details: [
      { title: 'Sculpted Façade', description: 'Curved balcony ribbons follow the shape of the shoreline.', x: 51, y: 31, compactX: 50 },
      { title: 'Private Marina', description: 'A residents-only berth and waterfront promenade.', x: 40, y: 84, compactX: 42, compactY: 75 },
    ],
  },
]

export const TOWER = { id: 'tower', name: 'The Tower', alt: TOWER_ALT }

export const RESIDENCES = [
  { floorId: '8', title: '2-Bed Residence', image: 'garden-residence', alt: 'A sunlit garden residence with a cream sofa and planted waterfront terrace.' },
  { floorId: '16', title: '3-Bed Residence', image: 'marina-residence', alt: 'A marina-facing living room with navy velvet and handblown amber lighting.' },
  { floorId: 'penthouse', title: 'Penthouse', image: 'penthouse', alt: 'A double-height penthouse with a curved wall of glass and sweeping sea views.' },
]

export const imageUrl = (name) => `${import.meta.env.BASE_URL}media/${name}.webp`
export const compactSceneQuery = '(width <= 760px)'

const imageRequests = new Map()

export function warmScene(id) {
  const compact = window.matchMedia(compactSceneQuery).matches
  const url = imageUrl(compact ? `${id}-compact` : id)
  if (!imageRequests.has(url)) {
    const img = new Image()
    img.src = url
    imageRequests.set(url, img.decode().catch(() => imageRequests.delete(url)))
  }
  return imageRequests.get(url)
}
