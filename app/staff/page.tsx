'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import {
  useStaffStore,
  type ClassEvent,
  type StaffMember,
  type Shift,
  type CalendarItem,
  type InventoryItem,
  type ResearchNote,
  type Task,
  type PrintJob,
} from '@/lib/staffStore';
import PinEntry from '@/components/PinEntry';

const STAFF_PIN = '1234';

// ─── Style tokens ─────────────────────────────────────────
const BG = '#F4EFE6';
const SIDEBAR = '#1C1917';
const CARD = '#FAF7F2';
const BORDER = '#E2D9CE';
const GOLD = '#B8962E';
const INK = '#1C1917';
const MUTED = '#78716C';
const WARM_AMBER = '#C45C26';

type Tab = 'overview' | 'shopify' | 'classes' | 'schedule' | 'calendar' | 'inventory' | 'research' | 'tasks' | 'settings';

const NAV: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'shopify', label: 'Shopify' },
  { key: 'classes', label: 'Classes' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'research', label: 'Research' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'settings', label: 'Settings' },
];

// ─── Shared UI primitives ────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: MUTED,
  fontFamily: 'var(--font-inter)',
  fontWeight: 500,
};

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant), Georgia, serif',
  fontWeight: 300,
  color: INK,
  letterSpacing: '-0.01em',
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <p style={labelStyle}>{label}</p>
      <p style={{ ...headingStyle, fontSize: 48, marginTop: 8, lineHeight: 1 }}>{value}</p>
      {hint && <p style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>{hint}</p>}
    </Card>
  );
}

function PillButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    borderRadius: 100,
    padding: '10px 22px',
    fontSize: 13,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    fontFamily: 'var(--font-inter)',
    fontWeight: 500,
    transition: 'opacity 120ms',
    ...style,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: GOLD, color: INK, border: 'none' },
    secondary: { backgroundColor: 'transparent', color: INK, border: `1px solid ${BORDER}` },
    danger: { backgroundColor: WARM_AMBER, color: '#fff', border: 'none' },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,25,23,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: CARD, borderRadius: 24, padding: 40, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ ...headingStyle, fontSize: 28 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ ...labelStyle, marginBottom: 6 }}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#fff', fontSize: 14, outline: 'none', fontFamily: 'var(--font-inter)' }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ ...labelStyle, marginBottom: 6 }}>{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-inter)' }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ ...labelStyle, marginBottom: 6 }}>{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: '#fff', fontSize: 14, outline: 'none', fontFamily: 'var(--font-inter)' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Pill({ children, color = GOLD, style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 100, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: color + '20', color, fontWeight: 500, ...style }}>
      {children}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function StaffPage() {
  const router = useRouter();
  const { setStaffAuthed } = useStore();
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => { setStaffAuthed(true); }, [setStaffAuthed]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex' }}>
      <Sidebar tab={tab} setTab={setTab} onSignOut={() => setStaffAuthed(false)} />
      <main style={{ flex: 1, padding: '40px 48px', overflowX: 'hidden' }}>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'shopify' && <ShopifyTab />}
        {tab === 'classes' && <ClassesTab />}
        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'calendar' && <CalendarTab />}
        {tab === 'inventory' && <InventoryTab />}
        {tab === 'research' && <ResearchTab />}
        {tab === 'tasks' && <TasksTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────

function PrintQueueBadge() {
  const router = useRouter();
  const { printQueue } = useStaffStore();
  const pending = (printQueue ?? []).filter((j: PrintJob) => j.status === 'pending').length;
  return (
    <button
      onClick={() => router.push('/staff/print')}
      style={{
        width: '100%', padding: '10px 16px', borderRadius: 12,
        backgroundColor: pending > 0 ? 'rgba(184,150,46,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${pending > 0 ? 'rgba(184,150,46,0.4)' : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: pending > 0 ? GOLD : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>
        Print Queue
      </span>
      {pending > 0 && (
        <span style={{ backgroundColor: GOLD, color: '#1C1917', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {pending}
        </span>
      )}
    </button>
  );
}

function Sidebar({ tab, setTab, onSignOut }: { tab: Tab; setTab: (t: Tab) => void; onSignOut: () => void }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        backgroundColor: SIDEBAR,
        padding: '32px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
      className="staff-sidebar"
    >
      <div style={{ padding: '0 28px', marginBottom: 36 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
          <Image src="/tcf-logo-white.svg" alt="The Cosmetic Formulary" width={44} height={44} style={{ opacity: 0.75 }} />
        </button>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#FAF7F2', fontWeight: 300, letterSpacing: '-0.01em' }}>Sip & Formulate</p>
        <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginTop: 4, fontFamily: 'var(--font-inter)' }}>Command Center</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 12, fontFamily: 'var(--font-inter)' }}>
          {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {NAV.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                background: 'none',
                border: 'none',
                borderLeft: active ? `2px solid ${GOLD}` : '2px solid transparent',
                padding: '11px 28px',
                textAlign: 'left',
                cursor: 'pointer',
                color: active ? GOLD : 'rgba(255,255,255,0.55)',
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: active ? 500 : 400,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '0 20px', marginTop: 16, marginBottom: 8 }}>
        <PrintQueueBadge />
      </div>

      <div style={{ padding: '0 28px', marginTop: 8 }}>
        <button
          onClick={onSignOut}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-inter)' }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Overview Tab ─────────────────────────────────────────

function OverviewTab() {
  const router = useRouter();
  const { classes, tasks, inventory, printQueue } = useStaffStore();
  const today = new Date().toISOString().slice(0, 10);

  const todayClasses = classes.filter((c) => c.date === today);
  const todaySeats = todayClasses.reduce((sum, c) => sum + c.booked, 0);
  const openTasks = tasks.filter((t) => t.status !== 'done').length;
  const lowStock = inventory.filter((i) => i.currentStock <= i.reorderPoint);
  const pendingLabels = (printQueue ?? []).filter((j: PrintJob) => j.status === 'pending');

  const upcoming = [...classes].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const urgent = tasks
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')
    .slice(0, 4);

  return (
    <div>
      <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Overview</h1>
      <p style={{ ...labelStyle, marginBottom: 24 }}>Today at the studio</p>

      {/* Print queue alert */}
      {pendingLabels.length > 0 && (
        <div
          onClick={() => router.push('/staff/print')}
          style={{
            backgroundColor: '#1C1917', borderRadius: 16, padding: '16px 24px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            border: `1px solid ${GOLD}`,
          }}
        >
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
              Labels ready to print
            </p>
            <p style={{ fontSize: 22, fontFamily: 'var(--font-cormorant)', fontWeight: 300, color: '#FAF7F2' }}>
              {pendingLabels.length} label{pendingLabels.length !== 1 ? 's' : ''} in queue — {pendingLabels.map(j => j.guestName.split(' ')[0]).join(', ')}
            </p>
          </div>
          <span style={{ fontSize: 20, color: GOLD }}>→</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Today's Classes" value={todayClasses.length} />
        <StatCard label="Seats Booked Today" value={todaySeats} />
        <StatCard label="Open Tasks" value={openTasks} />
        <StatCard label="Low Stock Items" value={lowStock.length} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <Card>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Upcoming Classes</p>
          {upcoming.map((c) => (
            <div key={c.id} style={{ padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ ...headingStyle, fontSize: 18 }}>{c.name}</p>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{c.date} · {c.time} — {c.booked}/{c.capacity} booked</p>
            </div>
          ))}
        </Card>
        <Card>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Urgent Tasks</p>
          {urgent.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>No urgent tasks.</p>}
          {urgent.map((t) => (
            <div key={t.id} style={{ padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{t.title}</p>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Due {t.dueDate} · {t.assignedTo}</p>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Needs Attention</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {lowStock.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>All stock healthy.</p>}
          {lowStock.map((i) => (
            <Pill key={i.id} color={i.currentStock <= i.reorderPoint * 0.7 ? WARM_AMBER : GOLD}>
              {i.name} — {i.currentStock} {i.unit}
            </Pill>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Shopify Tab ──────────────────────────────────────────

function ShopifyTab() {
  const { shopify, updateShopify } = useStaffStore();
  const [showConn, setShowConn] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [storeUrl, setStoreUrl] = useState(shopify.storeUrl);
  const [apiKey, setApiKey] = useState(shopify.apiKey);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      updateShopify({ storeUrl, apiKey, lastSynced: new Date().toISOString() });
      setConnecting(false);
    }, 1200);
  };

  return (
    <div>
      <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Shopify</h1>
      <p style={{ ...labelStyle, marginBottom: 32 }}>Last synced {new Date(shopify.lastSynced).toLocaleString()}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Orders" value={shopify.totalOrders} />
        <StatCard label="Total Revenue" value={`$${shopify.totalRevenue.toLocaleString()}`} />
        <StatCard label="Upsell Revenue" value={`$${shopify.upsellRevenue.toLocaleString()}`} />
        <StatCard label="Upsell Conv." value={`${Math.round(shopify.upsellConversion * 100)}%`} />
      </div>

      <Card style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Top Products</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 0', ...labelStyle }}>Product</th>
              <th style={{ textAlign: 'right', padding: '8px 0', ...labelStyle }}>Units</th>
              <th style={{ textAlign: 'right', padding: '8px 0', ...labelStyle }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {shopify.topProducts.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: '12px 0', fontSize: 14 }}>{p.name}</td>
                <td style={{ padding: '12px 0', fontSize: 14, textAlign: 'right' }}>{p.units}</td>
                <td style={{ padding: '12px 0', fontSize: 14, textAlign: 'right' }}>${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Recent Orders</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 0', ...labelStyle }}>Order</th>
              <th style={{ textAlign: 'left', padding: '8px 0', ...labelStyle }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '8px 0', ...labelStyle }}>Items</th>
              <th style={{ textAlign: 'right', padding: '8px 0', ...labelStyle }}>Total</th>
              <th style={{ textAlign: 'right', padding: '8px 0', ...labelStyle }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {shopify.recentOrders.map((o) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: '12px 0', fontSize: 14 }}>{o.id}</td>
                <td style={{ padding: '12px 0', fontSize: 14 }}>{o.customer}</td>
                <td style={{ padding: '12px 0', fontSize: 13, color: MUTED }}>{o.items}</td>
                <td style={{ padding: '12px 0', fontSize: 14, textAlign: 'right' }}>${o.total}</td>
                <td style={{ padding: '12px 0', fontSize: 13, textAlign: 'right', color: MUTED }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Low Stock Alerts</p>
        {shopify.lowStock.map((s, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{s.name}</p>
            <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.sku} · {s.stock} units remaining</p>
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showConn ? 16 : 0 }}>
          <p style={{ ...labelStyle }}>Connection Settings</p>
          <button onClick={() => setShowConn(!showConn)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {showConn ? 'Hide' : 'Show'}
          </button>
        </div>
        {showConn && (
          <div>
            <Input label="Shopify Store URL" value={storeUrl} onChange={setStoreUrl} placeholder="myshop.myshopify.com" />
            <Input label="Admin API Key" value={apiKey} onChange={setApiKey} type="password" placeholder="shpat_..." />
            <PillButton onClick={handleConnect}>{connecting ? 'Connecting…' : 'Connect Shopify'}</PillButton>
            <p style={{ fontSize: 11, color: MUTED, marginTop: 12, fontStyle: 'italic' }}>
              Shopify API requires server-side connection. Enter credentials in Settings to enable live sync.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Classes Tab ──────────────────────────────────────────

function ClassesTab() {
  const { classes, addClass, updateClass, deleteClass } = useStaffStore();
  const [editing, setEditing] = useState<ClassEvent | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Classes + Events</h1>
          <p style={labelStyle}>{classes.length} scheduled</p>
        </div>
        <PillButton onClick={() => setShowAdd(true)}>+ Add Class</PillButton>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {classes.map((c) => {
          const pct = c.capacity > 0 ? (c.booked / c.capacity) * 100 : 0;
          const isExpanded = expanded === c.id;
          return (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ ...headingStyle, fontSize: 24 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{c.date} · {c.time} · {c.duration} min</p>
                  <div style={{ marginTop: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: MUTED }}>{c.booked} / {c.capacity} booked</span>
                      <span style={{ color: MUTED }}>${c.revenue.toLocaleString()} + ${c.upsellRevenue} upsell</span>
                    </div>
                    <div style={{ height: 4, backgroundColor: BORDER, borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: GOLD }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                    {c.staffAssigned.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                    <Pill color={c.status === 'complete' ? MUTED : c.status === 'cancelled' ? WARM_AMBER : GOLD}>{c.status}</Pill>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <PillButton variant="secondary" onClick={() => setEditing(c)}>Edit</PillButton>
                  <PillButton variant="secondary" onClick={() => setExpanded(isExpanded ? null : c.id)}>{isExpanded ? 'Hide' : 'View Details'}</PillButton>
                </div>
              </div>
              {isExpanded && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <p style={{ ...labelStyle, marginBottom: 8 }}>Customers</p>
                    {c.customers.map((cu, i) => <p key={i} style={{ fontSize: 13, padding: '2px 0' }}>{cu}</p>)}
                  </div>
                  <div>
                    <p style={{ ...labelStyle, marginBottom: 8 }}>Kits Needed</p>
                    {c.kitsNeeded.map((k, i) => <p key={i} style={{ fontSize: 13, padding: '2px 0' }}>{k}</p>)}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ ...labelStyle, marginBottom: 8 }}>Notes</p>
                    <p style={{ fontSize: 13, color: MUTED }}>{c.notes}</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ ...labelStyle, marginBottom: 8 }}>Revenue Breakdown</p>
                    <p style={{ fontSize: 13 }}>Class Revenue: ${c.revenue.toLocaleString()}</p>
                    <p style={{ fontSize: 13 }}>Upsell Revenue: ${c.upsellRevenue.toLocaleString()}</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>Total: ${(c.revenue + c.upsellRevenue).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {(editing || showAdd) && (
        <ClassModal
          initial={editing}
          onClose={() => { setEditing(null); setShowAdd(false); }}
          onSave={(data) => {
            if (editing) updateClass(editing.id, data);
            else addClass(data);
            setEditing(null);
            setShowAdd(false);
          }}
          onDelete={editing ? () => { deleteClass(editing.id); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}

function ClassModal({ initial, onClose, onSave, onDelete }: { initial: ClassEvent | null; onClose: () => void; onSave: (c: Omit<ClassEvent, 'id'>) => void; onDelete?: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || '');
  const [time, setTime] = useState(initial?.time || '');
  const [duration, setDuration] = useState(initial?.duration || 90);
  const [capacity, setCapacity] = useState(initial?.capacity || 20);
  const [booked, setBooked] = useState(initial?.booked || 0);
  const [revenue, setRevenue] = useState(initial?.revenue || 0);
  const [upsellRevenue, setUpsellRevenue] = useState(initial?.upsellRevenue || 0);
  const [staffAssigned, setStaffAssigned] = useState((initial?.staffAssigned || []).join(', '));
  const [customers, setCustomers] = useState((initial?.customers || []).join('\n'));
  const [kitsNeeded, setKitsNeeded] = useState((initial?.kitsNeeded || []).join('\n'));
  const [notes, setNotes] = useState(initial?.notes || '');
  const [status, setStatus] = useState<ClassEvent['status']>(initial?.status || 'upcoming');

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Class' : 'Add Class'}>
      <Input label="Name" value={name} onChange={setName} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Date" value={date} onChange={setDate} type="date" />
        <Input label="Time" value={time} onChange={setTime} placeholder="2:00 PM" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Input label="Duration (min)" value={duration} onChange={(v) => setDuration(parseInt(v) || 0)} type="number" />
        <Input label="Capacity" value={capacity} onChange={(v) => setCapacity(parseInt(v) || 0)} type="number" />
        <Input label="Booked" value={booked} onChange={(v) => setBooked(parseInt(v) || 0)} type="number" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Revenue ($)" value={revenue} onChange={(v) => setRevenue(parseFloat(v) || 0)} type="number" />
        <Input label="Upsell Revenue ($)" value={upsellRevenue} onChange={(v) => setUpsellRevenue(parseFloat(v) || 0)} type="number" />
      </div>
      <Input label="Staff (comma-separated)" value={staffAssigned} onChange={setStaffAssigned} />
      <TextArea label="Customers (one per line)" value={customers} onChange={setCustomers} rows={4} />
      <TextArea label="Kits Needed (one per line)" value={kitsNeeded} onChange={setKitsNeeded} rows={3} />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <Select
        label="Status"
        value={status}
        onChange={(v) => setStatus(v as ClassEvent['status'])}
        options={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'active', label: 'Active' },
          { value: 'complete', label: 'Complete' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {onDelete ? <PillButton variant="danger" onClick={onDelete}>Delete</PillButton> : <div />}
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
          <PillButton onClick={() => onSave({ name, date, time, duration, capacity, booked, revenue, upsellRevenue, staffAssigned: staffAssigned.split(',').map((s) => s.trim()).filter(Boolean), customers: customers.split('\n').map((s) => s.trim()).filter(Boolean), kitsNeeded: kitsNeeded.split('\n').map((s) => s.trim()).filter(Boolean), notes, status })}>Save</PillButton>
        </div>
      </div>
    </Modal>
  );
}

// ─── Schedule Tab ─────────────────────────────────────────

function ScheduleTab() {
  const { staff, shifts, addStaff, updateStaff, deleteStaff, addShift, updateShift, deleteShift } = useStaffStore();
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [addShiftOpen, setAddShiftOpen] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Schedule</h1>
          <p style={labelStyle}>Staff & shifts</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={() => setAddStaffOpen(true)}>+ Add Staff</PillButton>
          <PillButton onClick={() => setAddShiftOpen(true)}>+ Add Shift</PillButton>
        </div>
      </div>

      <p style={{ ...labelStyle, marginBottom: 16 }}>Staff Members</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 40 }}>
        {staff.map((m) => (
          <Card key={m.id}>
            <h3 style={{ ...headingStyle, fontSize: 22 }}>{m.name}</h3>
            <p style={{ fontSize: 11, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, fontWeight: 500 }}>{m.role}</p>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 12 }}>{m.email}</p>
            <p style={{ fontSize: 13, color: MUTED }}>{m.phone}</p>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pill color={m.active ? '#5BAF8A' : MUTED}>{m.active ? 'Active' : 'Inactive'}</Pill>
              <PillButton variant="secondary" onClick={() => setEditingStaff(m)} style={{ padding: '6px 14px', fontSize: 12 }}>Edit</PillButton>
            </div>
          </Card>
        ))}
      </div>

      <p style={{ ...labelStyle, marginBottom: 16 }}>Upcoming Shifts</p>
      <Card>
        {shifts.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 13 }}>No shifts scheduled. Click + Add Shift.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Staff', 'Date', 'Start', 'End', 'Hours', 'Task', 'Notes', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 0', ...labelStyle }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((sh) => {
                const member = staff.find((m) => m.id === sh.staffId);
                return (
                  <tr key={sh.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 0', fontSize: 14 }}>{member?.name || 'Unknown'}</td>
                    <td style={{ padding: '12px 0', fontSize: 13 }}>{sh.date}</td>
                    <td style={{ padding: '12px 0', fontSize: 13 }}>{sh.startTime}</td>
                    <td style={{ padding: '12px 0', fontSize: 13 }}>{sh.endTime}</td>
                    <td style={{ padding: '12px 0', fontSize: 13 }}>{sh.hoursWorked}</td>
                    <td style={{ padding: '12px 0', fontSize: 13 }}>{sh.tasks.join(', ')}</td>
                    <td style={{ padding: '12px 0', fontSize: 13, color: MUTED }}>{sh.notes}</td>
                    <td style={{ padding: '12px 0', fontSize: 13, textAlign: 'right' }}>
                      <button onClick={() => setEditingShift(sh)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 12, marginRight: 8 }}>Edit</button>
                      <button onClick={() => deleteShift(sh.id)} style={{ background: 'none', border: 'none', color: WARM_AMBER, cursor: 'pointer', fontSize: 12 }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {(editingStaff || addStaffOpen) && (
        <StaffModal
          initial={editingStaff}
          onClose={() => { setEditingStaff(null); setAddStaffOpen(false); }}
          onSave={(data) => {
            if (editingStaff) updateStaff(editingStaff.id, data);
            else addStaff(data);
            setEditingStaff(null);
            setAddStaffOpen(false);
          }}
          onDelete={editingStaff ? () => { deleteStaff(editingStaff.id); setEditingStaff(null); } : undefined}
        />
      )}

      {(editingShift || addShiftOpen) && (
        <ShiftModal
          initial={editingShift}
          staff={staff}
          onClose={() => { setEditingShift(null); setAddShiftOpen(false); }}
          onSave={(data) => {
            if (editingShift) updateShift(editingShift.id, data);
            else addShift(data);
            setEditingShift(null);
            setAddShiftOpen(false);
          }}
        />
      )}
    </div>
  );
}

function StaffModal({ initial, onClose, onSave, onDelete }: { initial: StaffMember | null; onClose: () => void; onSave: (m: Omit<StaffMember, 'id'>) => void; onDelete?: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [role, setRole] = useState(initial?.role || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [availability, setAvailability] = useState(initial?.availability || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Staff Member' : 'Add Staff Member'}>
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Role" value={role} onChange={setRole} />
      <Input label="Email" value={email} onChange={setEmail} />
      <Input label="Phone" value={phone} onChange={setPhone} />
      <Input label="Availability" value={availability} onChange={setAvailability} />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {onDelete ? <PillButton variant="danger" onClick={onDelete}>Delete</PillButton> : <div />}
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
          <PillButton onClick={() => onSave({ name, role, email, phone, availability, notes, active, shifts: initial?.shifts || [] })}>Save</PillButton>
        </div>
      </div>
    </Modal>
  );
}

function ShiftModal({ initial, staff, onClose, onSave }: { initial: Shift | null; staff: StaffMember[]; onClose: () => void; onSave: (s: Omit<Shift, 'id'>) => void }) {
  const [staffId, setStaffId] = useState(initial?.staffId || staff[0]?.id || '');
  const [date, setDate] = useState(initial?.date || '');
  const [startTime, setStartTime] = useState(initial?.startTime || '');
  const [endTime, setEndTime] = useState(initial?.endTime || '');
  const [hoursWorked, setHoursWorked] = useState(initial?.hoursWorked || 0);
  const [tasks, setTasks] = useState((initial?.tasks || []).join(', '));
  const [classAssigned, setClassAssigned] = useState(initial?.classAssigned || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Shift' : 'Add Shift'}>
      <Select label="Staff" value={staffId} onChange={setStaffId} options={staff.map((m) => ({ value: m.id, label: m.name }))} />
      <Input label="Date" value={date} onChange={setDate} type="date" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Input label="Start" value={startTime} onChange={setStartTime} placeholder="9:00 AM" />
        <Input label="End" value={endTime} onChange={setEndTime} placeholder="5:00 PM" />
        <Input label="Hours" value={hoursWorked} onChange={(v) => setHoursWorked(parseFloat(v) || 0)} type="number" />
      </div>
      <Input label="Tasks (comma-separated)" value={tasks} onChange={setTasks} />
      <Input label="Class Assigned" value={classAssigned} onChange={setClassAssigned} />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
        <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
        <PillButton onClick={() => onSave({ staffId, date, startTime, endTime, hoursWorked, tasks: tasks.split(',').map((s) => s.trim()).filter(Boolean), classAssigned, notes })}>Save</PillButton>
      </div>
    </Modal>
  );
}

// ─── Calendar Tab ─────────────────────────────────────────

function CalendarTab() {
  const { calendar, addCalendarItem, updateCalendarItem, deleteCalendarItem } = useStaffStore();
  const [viewMonth, setViewMonth] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editing, setEditing] = useState<CalendarItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewMonth.toLocaleString('en-US', { month: 'long' });

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    calendar.forEach((i) => {
      if (!map[i.date]) map[i.date] = [];
      map[i.date].push(i);
    });
    return map;
  }, [calendar]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayItems = selectedDay ? itemsByDate[selectedDay] || [] : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Calendar</h1>
          <p style={labelStyle}>{monthName} {year}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={() => setViewMonth(new Date(year, month - 1, 1))}>←</PillButton>
          <PillButton variant="secondary" onClick={() => setViewMonth(new Date())}>Today</PillButton>
          <PillButton variant="secondary" onClick={() => setViewMonth(new Date(year, month + 1, 1))}>→</PillButton>
          <PillButton onClick={() => setAddOpen(true)}>+ Add Event</PillButton>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { color: GOLD, label: 'Class/Event' },
          { color: '#6B9EDE', label: 'Shift' },
          { color: '#DC2626', label: 'Deadline' },
          { color: '#5BAF8A', label: 'Launch' },
          { color: '#A78BCA', label: 'Photoshoot' },
          { color: MUTED, label: 'Vendor/Task' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: l.color }} />
            <span style={{ fontSize: 11, color: MUTED, letterSpacing: '0.08em' }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? '1fr 320px' : '1fr', gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ ...labelStyle, textAlign: 'center', padding: 8 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const items = itemsByDate[dateStr] || [];
              const isSelected = selectedDay === dateStr;
              const isToday = dateStr === new Date().toISOString().slice(0, 10);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(dateStr)}
                  style={{
                    aspectRatio: '1 / 1',
                    border: `1px solid ${isSelected ? GOLD : BORDER}`,
                    backgroundColor: isToday ? GOLD + '15' : '#fff',
                    borderRadius: 12,
                    padding: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{d}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                    {items.slice(0, 2).map((it) => (
                      <div key={it.id} style={{ fontSize: 9, color: it.color, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        ● {it.title}
                      </div>
                    ))}
                    {items.length > 2 && <span style={{ fontSize: 9, color: MUTED }}>+{items.length - 2} more</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {selectedDay && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={labelStyle}>Selected Day</p>
                <p style={{ ...headingStyle, fontSize: 22 }}>{selectedDay}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {dayItems.length === 0 ? (
              <p style={{ color: MUTED, fontSize: 13 }}>Nothing scheduled.</p>
            ) : (
              dayItems.map((it) => (
                <div key={it.id} style={{ borderLeft: `3px solid ${it.color}`, paddingLeft: 12, marginBottom: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{it.title}</p>
                  {it.time && <p style={{ fontSize: 12, color: MUTED }}>{it.time}</p>}
                  {it.notes && <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{it.notes}</p>}
                  <button onClick={() => setEditing(it)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 11, padding: 0, marginTop: 4 }}>Edit</button>
                </div>
              ))
            )}
          </Card>
        )}
      </div>

      {(editing || addOpen) && (
        <CalendarModal
          initial={editing}
          onClose={() => { setEditing(null); setAddOpen(false); }}
          onSave={(data) => {
            if (editing) updateCalendarItem(editing.id, data);
            else addCalendarItem(data);
            setEditing(null);
            setAddOpen(false);
          }}
          onDelete={editing ? () => { deleteCalendarItem(editing.id); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}

function CalendarModal({ initial, onClose, onSave, onDelete }: { initial: CalendarItem | null; onClose: () => void; onSave: (i: Omit<CalendarItem, 'id'>) => void; onDelete?: () => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || '');
  const [time, setTime] = useState(initial?.time || '');
  const [type, setType] = useState<CalendarItem['type']>(initial?.type || 'event');
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  const colors: Record<CalendarItem['type'], string> = {
    class: GOLD,
    event: GOLD,
    shift: '#6B9EDE',
    deadline: '#DC2626',
    reorder: WARM_AMBER,
    launch: '#5BAF8A',
    photoshoot: '#A78BCA',
    vendor: MUTED,
    task: MUTED,
  };

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Event' : 'Add Event'}>
      <Input label="Title" value={title} onChange={setTitle} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Date" value={date} onChange={setDate} type="date" />
        <Input label="Time" value={time} onChange={setTime} placeholder="2:00 PM" />
      </div>
      <Select
        label="Type"
        value={type}
        onChange={(v) => setType(v as CalendarItem['type'])}
        options={[
          { value: 'class', label: 'Class' },
          { value: 'event', label: 'Event' },
          { value: 'shift', label: 'Shift' },
          { value: 'deadline', label: 'Deadline' },
          { value: 'reorder', label: 'Reorder' },
          { value: 'launch', label: 'Launch' },
          { value: 'photoshoot', label: 'Photoshoot' },
          { value: 'vendor', label: 'Vendor' },
          { value: 'task', label: 'Task' },
        ]}
      />
      <Input label="Assigned To" value={assignedTo} onChange={setAssignedTo} />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {onDelete ? <PillButton variant="danger" onClick={onDelete}>Delete</PillButton> : <div />}
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
          <PillButton onClick={() => onSave({ title, date, time, type, color: colors[type], notes, assignedTo })}>Save</PillButton>
        </div>
      </div>
    </Modal>
  );
}

// ─── Inventory Tab ────────────────────────────────────────

function InventoryTab() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useStaffStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | InventoryItem['category']>('all');
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = inventory.filter((i) => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusOf = (i: InventoryItem) => {
    if (i.currentStock <= i.reorderPoint) return { label: 'Critical', color: WARM_AMBER };
    if (i.currentStock <= i.reorderPoint * 1.5) return { label: 'Low', color: GOLD };
    return { label: 'Good', color: '#5BAF8A' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Inventory</h1>
          <p style={labelStyle}>{filtered.length} items</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU…"
            style={{ padding: '10px 16px', borderRadius: 100, border: `1px solid ${BORDER}`, fontSize: 13, outline: 'none', width: 220 }}
          />
          <PillButton onClick={() => setAddOpen(true)}>+ Add Item</PillButton>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {([
          { v: 'all', l: 'All' },
          { v: 'product', l: 'Product' },
          { v: 'packaging', l: 'Packaging' },
          { v: 'raw-material', l: 'Raw Materials' },
          { v: 'class-supply', l: 'Class Supplies' },
        ] as const).map((f) => (
          <PillButton key={f.v} variant={filter === f.v ? 'primary' : 'secondary'} onClick={() => setFilter(f.v as typeof filter)}>{f.l}</PillButton>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Item', 'SKU', 'Category', 'Stock', 'Reorder At', 'Status', 'Supplier', ''].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 16px', ...labelStyle }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => {
              const st = statusOf(i);
              const isCritical = st.label === 'Critical';
              const isLow = st.label === 'Low';
              return (
                <tr key={i.id} style={{ borderBottom: `1px solid ${BORDER}`, borderLeft: isCritical ? `3px solid ${WARM_AMBER}` : isLow ? `3px solid ${GOLD}` : '3px solid transparent' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{i.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: MUTED }}>{i.sku}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{i.category}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{i.currentStock} {i.unit}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: MUTED }}>{i.reorderPoint}</td>
                  <td style={{ padding: '14px 16px' }}><Pill color={st.color}>{st.label}</Pill></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: MUTED }}>{i.supplier}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button onClick={() => setEditing(i)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {(editing || addOpen) && (
        <InventoryModal
          initial={editing}
          onClose={() => { setEditing(null); setAddOpen(false); }}
          onSave={(data) => {
            if (editing) updateInventoryItem(editing.id, data);
            else addInventoryItem(data);
            setEditing(null);
            setAddOpen(false);
          }}
          onDelete={editing ? () => { deleteInventoryItem(editing.id); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}

function InventoryModal({ initial, onClose, onSave, onDelete }: { initial: InventoryItem | null; onClose: () => void; onSave: (i: Omit<InventoryItem, 'id'>) => void; onDelete?: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [sku, setSku] = useState(initial?.sku || '');
  const [category, setCategory] = useState<InventoryItem['category']>(initial?.category || 'product');
  const [currentStock, setCurrentStock] = useState(initial?.currentStock || 0);
  const [reorderPoint, setReorderPoint] = useState(initial?.reorderPoint || 0);
  const [reorderQuantity, setReorderQuantity] = useState(initial?.reorderQuantity || 0);
  const [unit, setUnit] = useState(initial?.unit || 'units');
  const [cost, setCost] = useState(initial?.cost || 0);
  const [supplier, setSupplier] = useState(initial?.supplier || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Item' : 'Add Item'}>
      <Input label="Name" value={name} onChange={setName} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="SKU" value={sku} onChange={setSku} />
        <Select label="Category" value={category} onChange={(v) => setCategory(v as InventoryItem['category'])} options={[
          { value: 'product', label: 'Product' },
          { value: 'packaging', label: 'Packaging' },
          { value: 'raw-material', label: 'Raw Material' },
          { value: 'class-supply', label: 'Class Supply' },
        ]} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Input label="Current Stock" value={currentStock} onChange={(v) => setCurrentStock(parseFloat(v) || 0)} type="number" />
        <Input label="Reorder Point" value={reorderPoint} onChange={(v) => setReorderPoint(parseFloat(v) || 0)} type="number" />
        <Input label="Reorder Qty" value={reorderQuantity} onChange={(v) => setReorderQuantity(parseFloat(v) || 0)} type="number" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Unit" value={unit} onChange={setUnit} />
        <Input label="Cost ($)" value={cost} onChange={(v) => setCost(parseFloat(v) || 0)} type="number" />
      </div>
      <Input label="Supplier" value={supplier} onChange={setSupplier} />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {onDelete ? <PillButton variant="danger" onClick={onDelete}>Delete</PillButton> : <div />}
        <div style={{ display: 'flex', gap: 8 }}>
          <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
          <PillButton onClick={() => onSave({ name, sku, category, currentStock, reorderPoint, reorderQuantity, unit, cost, supplier, notes })}>Save</PillButton>
        </div>
      </div>
    </Modal>
  );
}

// ─── Research Tab ─────────────────────────────────────────

function ResearchTab() {
  const { research, addResearchNote, updateResearchNote, deleteResearchNote } = useStaffStore();
  const [filter, setFilter] = useState<'all' | ResearchNote['category']>('all');
  const [editing, setEditing] = useState<ResearchNote | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = research.filter((n) => filter === 'all' || n.category === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Research</h1>
          <p style={labelStyle}>{filtered.length} notes</p>
        </div>
        <PillButton onClick={() => setAddOpen(true)}>+ Add Note</PillButton>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'scent', 'packaging', 'formula', 'trend', 'competitor', 'supplier', 'idea'] as const).map((c) => (
          <PillButton key={c} variant={filter === c ? 'primary' : 'secondary'} onClick={() => setFilter(c as typeof filter)}>{c.charAt(0).toUpperCase() + c.slice(1)}</PillButton>
        ))}
      </div>

      <div style={{ columns: 2, columnGap: 16 }}>
        {filtered.map((n) => {
          const priorityColor = n.priority === 'high' ? '#DC2626' : n.priority === 'medium' ? GOLD : MUTED;
          const isExpanded = expanded === n.id;
          return (
            <div key={n.id} style={{ breakInside: 'avoid', marginBottom: 16 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Pill>{n.category}</Pill>
                  <div style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: priorityColor }} title={`Priority: ${n.priority}`} />
                </div>
                <h3 style={{ ...headingStyle, fontSize: 22, marginBottom: 8 }}>{n.title}</h3>
                <p
                  onClick={() => setExpanded(isExpanded ? null : n.id)}
                  style={{ fontSize: 13, color: INK, cursor: 'pointer', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: isExpanded ? undefined : 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {n.body}
                </p>
                {n.source && <p style={{ fontSize: 11, color: MUTED, marginTop: 12, fontStyle: 'italic' }}>{n.source}</p>}
                <p style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => setEditing(n)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => deleteResearchNote(n.id)} style={{ background: 'none', border: 'none', color: WARM_AMBER, cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {(editing || addOpen) && (
        <ResearchModal
          initial={editing}
          onClose={() => { setEditing(null); setAddOpen(false); }}
          onSave={(data) => {
            if (editing) updateResearchNote(editing.id, data);
            else addResearchNote(data);
            setEditing(null);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ResearchModal({ initial, onClose, onSave }: { initial: ResearchNote | null; onClose: () => void; onSave: (n: Omit<ResearchNote, 'id' | 'createdAt'>) => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [category, setCategory] = useState<ResearchNote['category']>(initial?.category || 'idea');
  const [body, setBody] = useState(initial?.body || '');
  const [source, setSource] = useState(initial?.source || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));
  const [priority, setPriority] = useState<ResearchNote['priority']>(initial?.priority || 'medium');

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Note' : 'Add Note'}>
      <Input label="Title" value={title} onChange={setTitle} />
      <Select label="Category" value={category} onChange={(v) => setCategory(v as ResearchNote['category'])} options={[
        { value: 'scent', label: 'Scent' },
        { value: 'packaging', label: 'Packaging' },
        { value: 'formula', label: 'Formula' },
        { value: 'trend', label: 'Trend' },
        { value: 'competitor', label: 'Competitor' },
        { value: 'supplier', label: 'Supplier' },
        { value: 'idea', label: 'Idea' },
      ]} />
      <TextArea label="Body" value={body} onChange={setBody} rows={6} />
      <Input label="Source" value={source} onChange={setSource} />
      <Input label="Tags (comma-separated)" value={tags} onChange={setTags} />
      <Select label="Priority" value={priority} onChange={(v) => setPriority(v as ResearchNote['priority'])} options={[
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ]} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
        <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
        <PillButton onClick={() => onSave({ title, category, body, source, tags: tags.split(',').map((s) => s.trim()).filter(Boolean), priority })}>Save</PillButton>
      </div>
    </Modal>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────

function TasksTab() {
  const { tasks, addTask, updateTask, deleteTask } = useStaffStore();
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done' | 'urgent'>('all');
  const [editing, setEditing] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return t.priority === 'urgent';
    return t.status === filter;
  });

  const columns: { key: Task['status']; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  const nextStage: Record<Task['status'], Task['status'] | null> = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': null,
  };

  const priorityColor = (p: Task['priority']) => p === 'urgent' ? WARM_AMBER : p === 'high' ? '#DC2626' : p === 'medium' ? GOLD : MUTED;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Tasks</h1>
          <p style={labelStyle}>{filtered.length} tasks</p>
        </div>
        <PillButton onClick={() => setAddOpen(true)}>+ Add Task</PillButton>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'todo', 'in-progress', 'done', 'urgent'] as const).map((f) => (
          <PillButton key={f} variant={filter === f ? 'primary' : 'secondary'} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}</PillButton>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <p style={{ ...labelStyle, marginBottom: 12 }}>{col.label} · {colTasks.length}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {colTasks.map((t) => {
                  const overdue = t.status !== 'done' && t.dueDate < new Date().toISOString().slice(0, 10);
                  const next = nextStage[t.status];
                  return (
                    <Card key={t.id} style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{t.title}</p>
                        <Pill color={priorityColor(t.priority)} style={{ marginLeft: 8 }}>{t.priority}</Pill>
                      </div>
                      <p style={{ fontSize: 12, color: MUTED, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10 }}>{t.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Pill color={MUTED}>{t.assignedTo}</Pill>
                        <span style={{ fontSize: 11, color: overdue ? WARM_AMBER : MUTED, fontWeight: overdue ? 600 : 400 }}>Due {t.dueDate}</span>
                      </div>
                      {next && (
                        <button onClick={() => updateTask(t.id, { status: next })} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 11, padding: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Move to {next === 'in-progress' ? 'In Progress' : 'Done'} →
                        </button>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={() => setEditing(t)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 11 }}>Edit</button>
                        <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: WARM_AMBER, cursor: 'pointer', fontSize: 11 }}>Delete</button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {(editing || addOpen) && (
        <TaskModal
          initial={editing}
          onClose={() => { setEditing(null); setAddOpen(false); }}
          onSave={(data) => {
            if (editing) updateTask(editing.id, data);
            else addTask(data);
            setEditing(null);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}

function TaskModal({ initial, onClose, onSave }: { initial: Task | null; onClose: () => void; onSave: (t: Omit<Task, 'id' | 'createdAt'>) => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate || '');
  const [priority, setPriority] = useState<Task['priority']>(initial?.priority || 'medium');
  const [status, setStatus] = useState<Task['status']>(initial?.status || 'todo');
  const [category, setCategory] = useState(initial?.category || '');

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Task' : 'Add Task'}>
      <Input label="Title" value={title} onChange={setTitle} />
      <TextArea label="Description" value={description} onChange={setDescription} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Assigned To" value={assignedTo} onChange={setAssignedTo} />
        <Input label="Due Date" value={dueDate} onChange={setDueDate} type="date" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Select label="Priority" value={priority} onChange={(v) => setPriority(v as Task['priority'])} options={[
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' },
        ]} />
        <Select label="Status" value={status} onChange={(v) => setStatus(v as Task['status'])} options={[
          { value: 'todo', label: 'To Do' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' },
        ]} />
        <Input label="Category" value={category} onChange={setCategory} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
        <PillButton variant="secondary" onClick={onClose}>Cancel</PillButton>
        <PillButton onClick={() => onSave({ title, description, assignedTo, dueDate, priority, status, category })}>Save</PillButton>
      </div>
    </Modal>
  );
}

// ─── Settings Tab ─────────────────────────────────────────

function SettingsTab() {
  const store = useStaffStore();
  const [storeUrl, setStoreUrl] = useState(store.shopify.storeUrl);
  const [apiKey, setApiKey] = useState(store.shopify.apiKey);
  const [staffPin, setStaffPin] = useState('1234');
  const [adminPin, setAdminPin] = useState('0000');
  const [businessName, setBusinessName] = useState('Sip & Formulate');
  const [location, setLocation] = useState('King Street, Charleston');
  const [email, setEmail] = useState('hello@cosmeticformulary.com');
  const [website, setWebsite] = useState('thecosmeticformulary.com');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    const data = {
      classes: store.classes,
      staff: store.staff,
      shifts: store.shifts,
      calendar: store.calendar,
      inventory: store.inventory,
      research: store.research,
      tasks: store.tasks,
      shopify: store.shopify,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sip-formulate-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('sip-formulate-staff-store');
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 style={{ ...headingStyle, fontSize: 40, marginBottom: 4 }}>Settings</h1>
      <p style={{ ...labelStyle, marginBottom: 32 }}>Configuration</p>

      <Card style={{ marginBottom: 16 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Shopify Connection</p>
        <Input label="Store URL" value={storeUrl} onChange={setStoreUrl} placeholder="myshop.myshopify.com" />
        <Input label="Admin API Key" value={apiKey} onChange={setApiKey} type="password" />
        <PillButton onClick={() => store.updateShopify({ storeUrl, apiKey, lastSynced: new Date().toISOString() })}>Save & Connect</PillButton>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Staff PINs</p>
        <Input label="Staff PIN" value={staffPin} onChange={setStaffPin} />
        <Input label="Admin PIN" value={adminPin} onChange={setAdminPin} />
        <PillButton onClick={() => alert('PINs saved (demo)')}>Save PINs</PillButton>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Business Info</p>
        <Input label="Business Name" value={businessName} onChange={setBusinessName} />
        <Input label="Location" value={location} onChange={setLocation} />
        <Input label="Contact Email" value={email} onChange={setEmail} />
        <Input label="Website" value={website} onChange={setWebsite} />
        <PillButton onClick={() => alert('Business info saved (demo)')}>Save</PillButton>
      </Card>

      <Card>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Data Management</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <PillButton variant="secondary" onClick={handleExport}>Export All Data (JSON)</PillButton>
          <PillButton variant="danger" onClick={() => setConfirmClear(true)}>Clear All Data</PillButton>
        </div>
      </Card>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear All Data?">
        <p style={{ fontSize: 14, color: INK, marginBottom: 20 }}>
          This will permanently erase all classes, staff, inventory, research, tasks, and calendar data stored in this browser. This cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <PillButton variant="secondary" onClick={() => setConfirmClear(false)}>Cancel</PillButton>
          <PillButton variant="danger" onClick={handleClear}>Yes, Clear Everything</PillButton>
        </div>
      </Modal>
    </div>
  );
}
