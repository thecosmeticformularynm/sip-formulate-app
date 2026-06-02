export interface Fragrance {
  id: string;
  name: string;
  category: 'Tropical' | 'Warm & Woody' | 'Citrus' | 'Floral' | 'Fresh & Clean' | 'Spa';
  mood: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  pairsWith: string[];
  active: boolean;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  active: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'coconut-milk',
    name: 'Coconut Milk',
    category: 'Tropical',
    mood: 'Tropical, creamy, nostalgic',
    topNotes: 'coconut, vanilla',
    heartNotes: 'cream, musk',
    baseNotes: 'sandalwood',
    pairsWith: ['pearl-white', 'champagne-gold'],
    active: true,
  },
  {
    id: 'vanilla-bean',
    name: 'Vanilla Bean',
    category: 'Warm & Woody',
    mood: 'Warm, rich, indulgent',
    topNotes: 'vanilla, caramel',
    heartNotes: 'amber, tonka',
    baseNotes: 'musk',
    pairsWith: ['champagne-gold', 'soft-pink'],
    active: true,
  },
  {
    id: 'pink-grapefruit',
    name: 'Pink Grapefruit',
    category: 'Citrus',
    mood: 'Bright, clean, energizing',
    topNotes: 'grapefruit, lemon',
    heartNotes: 'rose, jasmine',
    baseNotes: 'white musk',
    pairsWith: ['soft-pink', 'coral'],
    active: true,
  },
  {
    id: 'charleston-jasmine',
    name: 'Charleston Jasmine',
    category: 'Floral',
    mood: 'Southern, floral, elevated',
    topNotes: 'jasmine, white tea',
    heartNotes: 'soft musk, neroli',
    baseNotes: 'warm amber',
    pairsWith: ['pearl-white', 'lavender'],
    active: true,
  },
  {
    id: 'sea-salt-air',
    name: 'Sea Salt Air',
    category: 'Fresh & Clean',
    mood: 'Coastal, clean, airy',
    topNotes: 'sea salt, ozonic',
    heartNotes: 'driftwood, cucumber',
    baseNotes: 'warm musk',
    pairsWith: ['ocean-blue', 'seafoam-green'],
    active: true,
  },
  {
    id: 'lavender-cream',
    name: 'Lavender Cream',
    category: 'Spa',
    mood: 'Serene, soft, spa-like',
    topNotes: 'lavender, bergamot',
    heartNotes: 'cream, rose',
    baseNotes: 'sandalwood',
    pairsWith: ['lavender', 'pearl-white'],
    active: true,
  },
  {
    id: 'mango-nectar',
    name: 'Mango Nectar',
    category: 'Tropical',
    mood: 'Tropical, juicy, vibrant',
    topNotes: 'mango, papaya',
    heartNotes: 'passion fruit',
    baseNotes: 'vanilla',
    pairsWith: ['coral', 'champagne-gold'],
    active: true,
  },
  {
    id: 'champagne-peach',
    name: 'Champagne Peach',
    category: 'Floral',
    mood: 'Festive, delicate, sparkling',
    topNotes: 'peach, citrus',
    heartNotes: 'champagne, rose',
    baseNotes: 'musk',
    pairsWith: ['soft-pink', 'champagne-gold'],
    active: true,
  },
  {
    id: 'watermelon-sugar',
    name: 'Watermelon Sugar',
    category: 'Fresh & Clean',
    mood: 'Playful, fresh, summer',
    topNotes: 'watermelon, green',
    heartNotes: 'rose, jasmine',
    baseNotes: 'musk',
    pairsWith: ['coral', 'soft-pink'],
    active: true,
  },
  {
    id: 'pineapple-whip',
    name: 'Pineapple Whip',
    category: 'Tropical',
    mood: 'Tropical, creamy, bright',
    topNotes: 'pineapple, citrus',
    heartNotes: 'coconut, vanilla',
    baseNotes: 'musk',
    pairsWith: ['champagne-gold', 'seafoam-green'],
    active: true,
  },
  {
    id: 'amber-woods',
    name: 'Amber Woods',
    category: 'Warm & Woody',
    mood: 'Rich, complex, sophisticated',
    topNotes: 'amber, cedar',
    heartNotes: 'oud, patchouli',
    baseNotes: 'vanilla',
    pairsWith: ['champagne-gold', 'pearl-white'],
    active: true,
  },
  {
    id: 'spa-eucalyptus',
    name: 'Spa Eucalyptus',
    category: 'Spa',
    mood: 'Clean, medicinal, grounding',
    topNotes: 'eucalyptus, mint',
    heartNotes: 'tea tree, herbs',
    baseNotes: 'green musk',
    pairsWith: ['seafoam-green', 'ocean-blue'],
    active: true,
  },
  {
    id: 'black-orchid',
    name: 'Black Orchid',
    category: 'Floral',
    mood: 'Dark, mysterious, opulent',
    topNotes: 'orchid, black currant',
    heartNotes: 'dark rose, spice',
    baseNotes: 'amber, vetiver',
    pairsWith: ['lavender', 'coral'],
    active: true,
  },
  {
    id: 'honeysuckle-vine',
    name: 'Honeysuckle Vine',
    category: 'Floral',
    mood: 'Sweet, Southern, garden-fresh',
    topNotes: 'honeysuckle, jasmine',
    heartNotes: 'peony, green',
    baseNotes: 'light musk',
    pairsWith: ['soft-pink', 'seafoam-green'],
    active: true,
  },
  {
    id: 'fig-cashmere',
    name: 'Fig & Cashmere',
    category: 'Warm & Woody',
    mood: 'Sophisticated, dry, complex',
    topNotes: 'fig, green',
    heartNotes: 'cashmere, iris',
    baseNotes: 'sandalwood',
    pairsWith: ['champagne-gold', 'pearl-white'],
    active: true,
  },
  {
    id: 'coconut-lime-verbena',
    name: 'Coconut Lime Verbena',
    category: 'Tropical',
    mood: 'Bright, tropical, clean',
    topNotes: 'lime, verbena',
    heartNotes: 'coconut, citrus',
    baseNotes: 'white musk',
    pairsWith: ['seafoam-green', 'ocean-blue'],
    active: true,
  },
];

export const COLORS: Color[] = [
  { id: 'pearl-white', name: 'Pearl White', hex: '#F8F4EE', active: true },
  { id: 'soft-pink', name: 'Soft Pink', hex: '#F2C4CE', active: true },
  { id: 'ocean-blue', name: 'Ocean Blue', hex: '#7FB5C1', active: true },
  { id: 'seafoam-green', name: 'Seafoam Green', hex: '#A8C5B0', active: true },
  { id: 'lavender', name: 'Lavender', hex: '#C3B1D1', active: true },
  { id: 'champagne-gold', name: 'Champagne Gold', hex: '#D4AF6A', active: true },
  { id: 'coral', name: 'Coral', hex: '#E8896A', active: true },
  { id: 'clear', name: 'Clear', hex: 'transparent', active: true },
];

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'base',
    name: 'Bubble Bath Base',
    description: 'The foundation of your formula. A surfactant blend that creates rich, luxurious lather.',
    icon: '',
  },
  {
    id: 'skin-feel',
    name: 'Skin Feel Booster',
    description: 'Softness, amplified. Leaves skin feeling silky after every bath.',
    icon: '',
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    description: 'Your signature. The scent that makes this formula yours.',
    icon: '',
  },
  {
    id: 'colorant',
    name: 'Colorant',
    description: 'The visual note. A cosmetic-grade dye chosen for vibrancy and clarity.',
    icon: '',
  },
  {
    id: 'salt',
    name: 'Salt',
    description: 'The transformer. What turns your formula from thin to luxurious.',
    icon: '',
  },
  {
    id: 'preservative',
    name: 'Preservative System',
    description: 'What keeps it beautiful. Protects your formula for months.',
    icon: '',
  },
];

export const FRAGRANCE_CATEGORIES = ['All', 'Floral', 'Citrus', 'Warm & Woody', 'Fresh & Clean', 'Tropical', 'Spa'] as const;

export type FragranceCategory = typeof FRAGRANCE_CATEGORIES[number];
