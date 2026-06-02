import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────

export interface PageMediaItem {
  type: 'none' | 'image' | 'video';
  url: string;          // data URL (base64) or remote URL
  opacity: number;      // 0–100
  position: string;     // CSS object-position e.g. "center center"
}

export interface PageMediaConfig {
  landing: PageMediaItem;
  start: PageMediaItem;
  create: PageMediaItem;
  label: PageMediaItem;
  done: PageMediaItem;
}

const defaultMedia = (): PageMediaItem => ({ type: 'none', url: '', opacity: 40, position: 'center center' });
export const defaultPageMedia: PageMediaConfig = {
  landing: defaultMedia(),
  start: defaultMedia(),
  create: defaultMedia(),
  label: defaultMedia(),
  done: defaultMedia(),
};

export interface ClassEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  booked: number;
  revenue: number;
  upsellRevenue: number;
  staffAssigned: string[];
  customers: string[];
  kitsNeeded: string[];
  notes: string;
  status: 'upcoming' | 'active' | 'complete' | 'cancelled';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  shifts: Shift[];
  availability: string;
  notes: string;
  active: boolean;
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  tasks: string[];
  classAssigned: string;
  notes: string;
}

export interface CalendarItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'class' | 'event' | 'shift' | 'deadline' | 'reorder' | 'launch' | 'photoshoot' | 'vendor' | 'task';
  color: string;
  notes: string;
  assignedTo?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'product' | 'packaging' | 'raw-material' | 'class-supply';
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unit: string;
  cost: number;
  supplier: string;
  notes: string;
  lastOrdered?: string;
}

export interface ResearchNote {
  id: string;
  category: 'scent' | 'packaging' | 'formula' | 'trend' | 'competitor' | 'supplier' | 'idea';
  title: string;
  body: string;
  tags: string[];
  source: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: string;
}

export interface PrintJob {
  id: string;
  approvedAt: string;
  guestName: string;
  productName: string;
  fragranceName: string;
  colorName: string;
  viscosity: string;
  date: string;
  status: 'pending' | 'printed';
  printedAt?: string;
}

export interface ShopifySnapshot {
  lastSynced: string;
  totalOrders: number;
  totalRevenue: number;
  upsellRevenue: number;
  upsellConversion: number;
  topProducts: { name: string; units: number; revenue: number }[];
  lowStock: { name: string; sku: string; stock: number }[];
  recentOrders: { id: string; customer: string; total: number; date: string; items: string }[];
  apiKey: string;
  storeUrl: string;
}

export interface StaffStore {
  classes: ClassEvent[];
  staff: StaffMember[];
  shifts: Shift[];
  calendar: CalendarItem[];
  inventory: InventoryItem[];
  research: ResearchNote[];
  tasks: Task[];
  shopify: ShopifySnapshot;
  printQueue: PrintJob[];

  addPrintJob: (job: Omit<PrintJob, 'id' | 'approvedAt' | 'status'>) => void;
  markPrinted: (id: string) => void;
  deletePrintJob: (id: string) => void;
  clearPrintedJobs: () => void;

  addClass: (c: Omit<ClassEvent, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassEvent>) => void;
  deleteClass: (id: string) => void;

  addStaff: (s: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  addShift: (s: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;

  addCalendarItem: (item: Omit<CalendarItem, 'id'>) => void;
  updateCalendarItem: (id: string, updates: Partial<CalendarItem>) => void;
  deleteCalendarItem: (id: string) => void;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  addResearchNote: (note: Omit<ResearchNote, 'id' | 'createdAt'>) => void;
  updateResearchNote: (id: string, updates: Partial<ResearchNote>) => void;
  deleteResearchNote: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  updateShopify: (updates: Partial<ShopifySnapshot>) => void;

  pageMedia: PageMediaConfig;
  setPageMedia: (page: keyof PageMediaConfig, item: PageMediaItem) => void;
}

const uid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

// ─── Mock Data ────────────────────────────────────────────

const mockClasses: ClassEvent[] = [
  {
    id: uid(),
    name: 'Bubble Bath Lab',
    date: '2026-06-14',
    time: '2:00 PM',
    duration: 90,
    capacity: 24,
    booked: 18,
    revenue: 1620,
    upsellRevenue: 320,
    staffAssigned: ['Sarah M.', 'Jordan K.'],
    customers: ['Ava Mitchell', 'Bella Torres', 'Cara Nguyen', 'Diana Lee'],
    kitsNeeded: ['24x Bubble Bath Base Kits', '6x Fragrance Trays', 'Extra Salt'],
    notes: 'Need 24 bubble bath base kits, 6 fragrance trays, extra salt',
    status: 'upcoming',
  },
  {
    id: uid(),
    name: 'Lotion Making 101',
    date: '2026-06-18',
    time: '6:00 PM',
    duration: 120,
    capacity: 16,
    booked: 16,
    revenue: 1280,
    upsellRevenue: 480,
    staffAssigned: ['Sarah M.'],
    customers: ['Elena Ross', 'Fiona Walsh', 'Grace Kim'],
    kitsNeeded: ['16x Lotion Base Kits', '4x Fragrance Trays'],
    notes: 'Fully booked — prepare waitlist form',
    status: 'upcoming',
  },
  {
    id: uid(),
    name: 'Bachelorette Party — Rhodes',
    date: '2026-06-21',
    time: '4:00 PM',
    duration: 150,
    capacity: 12,
    booked: 12,
    revenue: 1440,
    upsellRevenue: 360,
    staffAssigned: ['Sarah M.', 'Taylor B.'],
    customers: ['Jessica Rhodes (Host)', '+11 guests'],
    kitsNeeded: ['12x Custom Kits', 'Champagne service'],
    notes: 'Private event. Coordinate champagne service.',
    status: 'upcoming',
  },
  {
    id: uid(),
    name: 'Sugar Scrub Workshop',
    date: '2026-06-28',
    time: '11:00 AM',
    duration: 75,
    capacity: 20,
    booked: 7,
    revenue: 560,
    upsellRevenue: 140,
    staffAssigned: ['Jordan K.'],
    customers: ['Hannah Park', 'Isla Brown'],
    kitsNeeded: ['20x Sugar Scrub Kits'],
    notes: 'Push social media — under-booked',
    status: 'upcoming',
  },
];

const mockStaff: StaffMember[] = [
  { id: uid(), name: 'Sarah Mitchell', role: 'Lead Instructor', email: 'sarah@cosmeticformulary.com', phone: '843-555-0142', shifts: [], availability: 'Tue-Sat', notes: 'Lead formulator, runs most workshops', active: true },
  { id: uid(), name: 'Jordan Kim', role: 'Studio Assistant', email: 'jordan@cosmeticformulary.com', phone: '843-555-0188', shifts: [], availability: 'Wed-Sun', notes: 'Strong with class prep', active: true },
  { id: uid(), name: 'Alex Rivera', role: 'Floor Manager', email: 'alex@cosmeticformulary.com', phone: '843-555-0173', shifts: [], availability: 'Mon-Fri', notes: 'Handles inventory & ordering', active: true },
  { id: uid(), name: 'Taylor Brooks', role: 'Marketing & Events', email: 'taylor@cosmeticformulary.com', phone: '843-555-0196', shifts: [], availability: 'Flexible', notes: 'Social, events, content', active: true },
];

const mockInventory: InventoryItem[] = [
  { id: uid(), name: 'Bubble Bath Base', sku: 'RM-BB-001', category: 'raw-material', currentStock: 48, reorderPoint: 20, reorderQuantity: 30, unit: 'units', cost: 8.5, supplier: 'Lotioncrafter', notes: '' },
  { id: uid(), name: 'Fragrance Oils Set', sku: 'CS-FO-001', category: 'class-supply', currentStock: 6, reorderPoint: 3, reorderQuantity: 4, unit: 'trays', cost: 120, supplier: 'BrambleBerry', notes: '' },
  { id: uid(), name: '16oz Amber Bottles', sku: 'PKG-AB-016', category: 'packaging', currentStock: 120, reorderPoint: 50, reorderQuantity: 100, unit: 'units', cost: 1.8, supplier: 'SKS Bottle', notes: '' },
  { id: uid(), name: 'Custom Labels', sku: 'PKG-LBL-001', category: 'packaging', currentStock: 85, reorderPoint: 40, reorderQuantity: 200, unit: 'units', cost: 0.65, supplier: 'StickerGiant', notes: 'LOW — order soon' },
  { id: uid(), name: 'Shea Butter', sku: 'RM-SB-LB', category: 'raw-material', currentStock: 12, reorderPoint: 5, reorderQuantity: 10, unit: 'lbs', cost: 14, supplier: 'Lotioncrafter', notes: '' },
  { id: uid(), name: 'Vitamin E Oil', sku: 'RM-VE-500', category: 'raw-material', currentStock: 8, reorderPoint: 4, reorderQuantity: 6, unit: 'bottles', cost: 22, supplier: 'BrambleBerry', notes: 'LOW' },
  { id: uid(), name: 'Sea Salt Fine', sku: 'RM-SS-LB', category: 'raw-material', currentStock: 25, reorderPoint: 10, reorderQuantity: 20, unit: 'lbs', cost: 4.5, supplier: 'Local Co-op', notes: '' },
  { id: uid(), name: 'Cosmetic Glitter', sku: 'CS-GL-001', category: 'class-supply', currentStock: 3, reorderPoint: 5, reorderQuantity: 10, unit: 'jars', cost: 18, supplier: 'BrambleBerry', notes: 'CRITICAL — order now' },
  { id: uid(), name: 'Colorant Drops Set', sku: 'CS-CD-001', category: 'class-supply', currentStock: 9, reorderPoint: 6, reorderQuantity: 6, unit: 'sets', cost: 32, supplier: 'BrambleBerry', notes: '' },
  { id: uid(), name: 'Lotion Base', sku: 'RM-LB-LB', category: 'raw-material', currentStock: 22, reorderPoint: 10, reorderQuantity: 20, unit: 'lbs', cost: 9, supplier: 'Lotioncrafter', notes: '' },
  { id: uid(), name: 'Stirring Rods', sku: 'CS-SR-001', category: 'class-supply', currentStock: 200, reorderPoint: 50, reorderQuantity: 100, unit: 'units', cost: 0.25, supplier: 'Amazon', notes: '' },
  { id: uid(), name: 'Lip Balm Tubes', sku: 'PKG-LBT-001', category: 'packaging', currentStock: 28, reorderPoint: 50, reorderQuantity: 100, unit: 'units', cost: 0.4, supplier: 'SKS Bottle', notes: 'CRITICAL' },
];

const mockResearch: ResearchNote[] = [
  { id: uid(), category: 'trend', title: 'Top Trending Scents 2026', body: 'Customers overwhelmingly requesting gourmand and skin-scent profiles. Vanilla, sandalwood, and rice milk trending heavily on TikTok. Black orchid and iris requested weekly.', tags: ['scent', 'trend', '2026'], source: 'In-store feedback + TikTok', createdAt: new Date().toISOString(), priority: 'high' },
  { id: uid(), category: 'packaging', title: 'Packaging Preference Data', body: 'Frosted glass with minimalist labels outperforming clear plastic 3:1. Round bottles preferred over square. Customers keep asking for travel sizes.', tags: ['packaging', 'data'], source: 'Customer surveys May 2026', createdAt: new Date().toISOString(), priority: 'high' },
  { id: uid(), category: 'idea', title: 'Scalp Care Opportunity', body: '5 customers in June asked about scalp serums and hair oils. Huge untapped market. Look into BTMS-50 and castor oil base formulas.', tags: ['hair', 'expansion'], source: 'In-store requests', createdAt: new Date().toISOString(), priority: 'medium' },
  { id: uid(), category: 'competitor', title: 'Competitor Analysis - Local', body: 'Analyzed 3 local competitors. None offer custom formulation experience. We are the only atelier-style cosmetic experience in Charleston.', tags: ['competition', 'positioning'], source: 'Field research', createdAt: new Date().toISOString(), priority: 'medium' },
  { id: uid(), category: 'formula', title: 'Sugar Scrub Formula Notes', body: 'Best results: 60% sugar, 25% coconut oil, 10% fragrance, 5% vitamin E. Customers love the lemon-lavender combo.', tags: ['formula', 'scrub'], source: 'Internal testing', createdAt: new Date().toISOString(), priority: 'low' },
  { id: uid(), category: 'supplier', title: 'Supplier Research - Lotioncrafter', body: 'Lotioncrafter has BTMS-50 in stock, $28/lb. MOQ 1lb. Silk amino acids also available. Worth adding to lotion workshop kit.', tags: ['supplier', 'sourcing'], source: 'lotioncrafter.com', createdAt: new Date().toISOString(), priority: 'medium' },
];

const mockTasks: Task[] = [
  { id: uid(), title: 'Order custom labels before June 20', description: 'Stock running low. Reorder 200 units from StickerGiant.', assignedTo: 'Alex Rivera', dueDate: '2026-06-20', priority: 'urgent', status: 'todo', category: 'Inventory', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Prepare 18 Bubble Bath kits for June 14 class', description: 'Each kit: base, fragrance tray, salt, colorant, label.', assignedTo: 'Jordan Kim', dueDate: '2026-06-13', priority: 'high', status: 'in-progress', category: 'Class Prep', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Follow up with Rhodes bachelorette party re: menu', description: 'Confirm champagne service and dietary restrictions.', assignedTo: 'Taylor Brooks', dueDate: '2026-06-18', priority: 'medium', status: 'todo', category: 'Events', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Update Shopify product photos for lotion kits', description: 'New photography from last shoot needs upload.', assignedTo: 'Taylor Brooks', dueDate: '2026-06-22', priority: 'medium', status: 'in-progress', category: 'Marketing', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Reorder Vitamin E Oil', description: '6 bottles from BrambleBerry.', assignedTo: 'Alex Rivera', dueDate: '2026-06-15', priority: 'high', status: 'todo', category: 'Inventory', createdAt: new Date().toISOString() },
  { id: uid(), title: 'Create Instagram content from last Saturday class', description: 'Edit photos and draft 3 posts.', assignedTo: 'Taylor Brooks', dueDate: '2026-06-10', priority: 'low', status: 'done', category: 'Marketing', createdAt: new Date().toISOString() },
];

const mockCalendar: CalendarItem[] = [
  { id: uid(), title: 'Bubble Bath Lab', date: '2026-06-14', time: '2:00 PM', type: 'class', color: '#B8962E', notes: '18/24 booked' },
  { id: uid(), title: 'Product photo shoot', date: '2026-06-16', time: '10:00 AM', type: 'photoshoot', color: '#A78BCA', notes: 'New lotion line' },
  { id: uid(), title: 'Vendor call: Lotioncrafter', date: '2026-06-17', time: '3:00 PM', type: 'vendor', color: '#A8A29E', notes: 'Discuss BTMS-50' },
  { id: uid(), title: 'Lotion Making 101', date: '2026-06-18', time: '6:00 PM', type: 'class', color: '#B8962E', notes: 'Fully booked' },
  { id: uid(), title: 'Label reorder deadline', date: '2026-06-20', type: 'deadline', color: '#DC2626', notes: 'Custom Labels' },
  { id: uid(), title: 'Rhodes Bachelorette Event', date: '2026-06-21', time: '4:00 PM', type: 'event', color: '#B8962E', notes: 'Private event' },
  { id: uid(), title: 'Sugar Scrub Workshop', date: '2026-06-28', time: '11:00 AM', type: 'class', color: '#B8962E', notes: '7/20 booked' },
  { id: uid(), title: 'Shopify sale launch', date: '2026-06-30', type: 'launch', color: '#5BAF8A', notes: 'Summer sale begins' },
];

const mockShopify: ShopifySnapshot = {
  lastSynced: new Date().toISOString(),
  totalOrders: 148,
  totalRevenue: 18420,
  upsellRevenue: 3280,
  upsellConversion: 0.34,
  topProducts: [
    { name: 'Bubble Bath Kit', units: 62, revenue: 4340 },
    { name: 'Lotion Kit', units: 38, revenue: 3040 },
    { name: 'Gift Set Bundle', units: 24, revenue: 2880 },
  ],
  lowStock: [
    { name: 'Custom Labels', sku: 'PKG-LBL-001', stock: 85 },
    { name: 'Vitamin E Oil', sku: 'RM-VE-500', stock: 8 },
  ],
  recentOrders: [
    { id: '#1058', customer: 'Ava Mitchell', total: 124, date: '2026-06-01', items: 'Bubble Bath Kit + Fragrance' },
    { id: '#1057', customer: 'Bella Torres', total: 86, date: '2026-06-01', items: 'Lotion Kit' },
    { id: '#1056', customer: 'Cara Nguyen', total: 215, date: '2026-05-31', items: 'Gift Set Bundle + Add-ons' },
    { id: '#1055', customer: 'Diana Lee', total: 64, date: '2026-05-31', items: 'Sugar Scrub Kit' },
    { id: '#1054', customer: 'Elena Ross', total: 168, date: '2026-05-30', items: 'Bubble Bath + Lotion Combo' },
  ],
  apiKey: '',
  storeUrl: '',
};

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      classes: mockClasses,
      staff: mockStaff,
      shifts: [],
      calendar: mockCalendar,
      inventory: mockInventory,
      research: mockResearch,
      tasks: mockTasks,
      shopify: mockShopify,

      addClass: (c) => set((s) => ({ classes: [...s.classes, { ...c, id: uid() }] })),
      updateClass: (id, updates) => set((s) => ({ classes: s.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      deleteClass: (id) => set((s) => ({ classes: s.classes.filter((c) => c.id !== id) })),

      addStaff: (m) => set((s) => ({ staff: [...s.staff, { ...m, id: uid() }] })),
      updateStaff: (id, updates) => set((s) => ({ staff: s.staff.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteStaff: (id) => set((s) => ({ staff: s.staff.filter((m) => m.id !== id) })),

      addShift: (sh) => set((s) => ({ shifts: [...s.shifts, { ...sh, id: uid() }] })),
      updateShift: (id, updates) => set((s) => ({ shifts: s.shifts.map((sh) => (sh.id === id ? { ...sh, ...updates } : sh)) })),
      deleteShift: (id) => set((s) => ({ shifts: s.shifts.filter((sh) => sh.id !== id) })),

      addCalendarItem: (item) => set((s) => ({ calendar: [...s.calendar, { ...item, id: uid() }] })),
      updateCalendarItem: (id, updates) => set((s) => ({ calendar: s.calendar.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),
      deleteCalendarItem: (id) => set((s) => ({ calendar: s.calendar.filter((i) => i.id !== id) })),

      addInventoryItem: (item) => set((s) => ({ inventory: [...s.inventory, { ...item, id: uid() }] })),
      updateInventoryItem: (id, updates) => set((s) => ({ inventory: s.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),
      deleteInventoryItem: (id) => set((s) => ({ inventory: s.inventory.filter((i) => i.id !== id) })),

      addResearchNote: (note) => set((s) => ({ research: [...s.research, { ...note, id: uid(), createdAt: new Date().toISOString() }] })),
      updateResearchNote: (id, updates) => set((s) => ({ research: s.research.map((n) => (n.id === id ? { ...n, ...updates } : n)) })),
      deleteResearchNote: (id) => set((s) => ({ research: s.research.filter((n) => n.id !== id) })),

      addTask: (task) => set((s) => ({ tasks: [...s.tasks, { ...task, id: uid(), createdAt: new Date().toISOString() }] })),
      updateTask: (id, updates) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      updateShopify: (updates) => set((s) => ({ shopify: { ...s.shopify, ...updates } })),

      pageMedia: defaultPageMedia,
      setPageMedia: (page, item) => set((s) => ({ pageMedia: { ...s.pageMedia, [page]: item } })),

      printQueue: [],
      addPrintJob: (job) => set((s) => ({
        printQueue: [{ ...job, id: uid(), approvedAt: new Date().toISOString(), status: 'pending' }, ...s.printQueue],
      })),
      markPrinted: (id) => set((s) => ({
        printQueue: s.printQueue.map((j) => j.id === id ? { ...j, status: 'printed', printedAt: new Date().toISOString() } : j),
      })),
      deletePrintJob: (id) => set((s) => ({ printQueue: s.printQueue.filter((j) => j.id !== id) })),
      clearPrintedJobs: () => set((s) => ({ printQueue: s.printQueue.filter((j) => j.status === 'pending') })),
    }),
    {
      name: 'sip-formulate-staff-store',
    }
  )
);
