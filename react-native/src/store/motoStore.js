/**
 * MotoPark Store — community motorcycle parking spots
 */
import { create } from 'zustand';

// Demo parking spots seeded from real AU cities
// Types: footpath, bay, dedicated, undercover
export const DEMO_SPOTS = [
  // Sydney CBD
  { id: 'syd-1', name: 'Pitt St Footpath Zone', lat: -33.8696, lng: 151.2094,
    type: 'footpath', free: true, covered: false, restriction: 'Unlimited',
    bikes: 12, confirmed: 47, rating: 4.8, city: 'Sydney',
    tip: 'Long strip on Pitt St between Market and King. No time limit ever enforced.', added: '2024-03' },
  { id: 'syd-2', name: 'Hyde Park North Edge', lat: -33.8716, lng: 151.2108,
    type: 'bay', free: true, covered: false, restriction: 'Unlimited',
    bikes: 6, confirmed: 23, rating: 4.5, city: 'Sydney',
    tip: 'Marked motorcycle bays on College St. Never had a ticket here.', added: '2024-06' },
  { id: 'syd-3', name: 'World Square Undercover', lat: -33.8753, lng: 151.2062,
    type: 'undercover', free: true, covered: true, restriction: '2hr',
    bikes: 20, confirmed: 31, rating: 4.2, city: 'Sydney',
    tip: 'Level B1 car park has free bike area near the lift. 2hr but rarely checked.', added: '2024-08' },

  // Melbourne CBD
  { id: 'mel-1', name: 'Swanston St Footpath', lat: -37.8136, lng: 144.9631,
    type: 'footpath', free: true, covered: false, restriction: 'Unlimited',
    bikes: 8, confirmed: 62, rating: 4.9, city: 'Melbourne',
    tip: 'Classic Melbourne footpath parking. Council approved zone, always been fine.', added: '2023-11' },
  { id: 'mel-2', name: 'Flinders Lane Alcove', lat: -37.8162, lng: 144.9677,
    type: 'footpath', free: true, covered: false, restriction: 'Unlimited',
    bikes: 5, confirmed: 38, rating: 4.7, city: 'Melbourne',
    tip: 'Tight but works. Between buildings, gets shade in afternoon.', added: '2024-01' },
  { id: 'mel-3', name: 'Bourke St Bike Bays', lat: -37.8144, lng: 144.9600,
    type: 'bay', free: true, covered: false, restriction: '4hr',
    bikes: 10, confirmed: 19, rating: 4.3, city: 'Melbourne',
    tip: 'Marked council bays. 4hr limit but it\'s fine for day rides into the city.', added: '2024-05' },

  // Brisbane
  { id: 'bne-1', name: 'Queen St Mall End', lat: -27.4698, lng: 153.0251,
    type: 'footpath', free: true, covered: false, restriction: 'Unlimited',
    bikes: 15, confirmed: 44, rating: 4.6, city: 'Brisbane',
    tip: 'Up to 10 bikes usually here. Hot spot for CBD workers.', added: '2024-02' },
  { id: 'bne-2', name: 'Roma St Station Side', lat: -27.4654, lng: 153.0183,
    type: 'dedicated', free: true, covered: true, restriction: 'Unlimited',
    bikes: 30, confirmed: 71, rating: 4.9, city: 'Brisbane',
    tip: 'Best spot in Brisbane. Covered dedicated motorcycle area, huge capacity.', added: '2023-09' },

  // Adelaide
  { id: 'adl-1', name: 'Rundle Mall Footpath West', lat: -34.9222, lng: 138.5997,
    type: 'footpath', free: true, covered: false, restriction: 'Unlimited',
    bikes: 8, confirmed: 29, rating: 4.4, city: 'Adelaide',
    tip: 'Easy access, always room. SA is very bike-friendly in the CBD.', added: '2024-04' },
];

const TYPE_ICONS = {
  footpath:   '🛣️',
  bay:        '🅿️',
  dedicated:  '🏍️',
  undercover: '🏢',
};

const TYPE_LABELS = {
  footpath:   'Footpath Parking',
  bay:        'Marked Bike Bay',
  dedicated:  'Dedicated Area',
  undercover: 'Undercover',
};

export const useMotoStore = create((set, get) => ({
  spots: DEMO_SPOTS,
  selectedSpot: null,
  filter: 'all',     // all | covered | dedicated | footpath
  city: 'all',
  phase: 'login',    // login | map | detail | add | about | booking
  reservations: [],

  completeLogin: () => set({ phase: 'map' }),

  selectSpot: (id) => {
    const spot = get().spots.find(s => s.id === id) || null;
    set({ selectedSpot: spot, phase: spot ? 'detail' : 'map' });
  },
  clearSelected: () => set({ selectedSpot: null, phase: 'map' }),

  setFilter: (f) => set({ filter: f }),
  setCity: (c) => set({ city: c }),
  setPhase: (p) => set({ phase: p }),

  filteredSpots: () => {
    const { spots, filter, city } = get();
    return spots.filter(s => {
      if (city !== 'all' && s.city !== city) return false;
      if (filter === 'covered') return s.covered;
      if (filter === 'dedicated') return s.type === 'dedicated' || s.type === 'bay';
      if (filter === 'footpath') return s.type === 'footpath';
      return true;
    });
  },

  // Simulate confirming a spot (community validation)
  confirmSpot: (id) => {
    set(state => ({
      spots: state.spots.map(s => s.id === id ? { ...s, confirmed: s.confirmed + 1 } : s),
    }));
  },

  getTypeIcon: (type) => TYPE_ICONS[type] || '📍',
  getTypeLabel: (type) => TYPE_LABELS[type] || type,

  addReservation: (reservation) => {
    set(state => ({ reservations: [reservation, ...state.reservations] }));
  },
}));
