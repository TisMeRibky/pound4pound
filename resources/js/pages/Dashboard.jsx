import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const TOKEN = () => localStorage.getItem('token');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      <span className={`text-3xl font-extrabold ${accent || 'text-[#03023B]'}`}>{value ?? '—'}</span>
      {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">{children}</h2>
  );
}

function DaysLeftBadge({ days }) {
  const color = days <= 3
    ? 'bg-red-100 text-red-600'
    : days <= 7
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-blue-50 text-blue-600';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {days === 0 ? 'Today' : `${days}d left`}
    </span>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = TOKEN();
    if (!token) { navigate('/'); return; }

    // Fetch user
    fetch('/api/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(d => setUser(d.data?.user ?? d))
      .catch(() => { localStorage.removeItem('token'); navigate('/'); });

    // Fetch dashboard stats
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(d => { setStats(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (!user || loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-gray-400 animate-pulse text-lg font-semibold tracking-widest">Loading...</div>
    </div>
  );

  const m = stats?.members ?? {};
  const rev = stats?.revenue ?? {};
  const chartData = rev.chart ?? [];
  const expiringMemberships = stats?.expiring_memberships ?? [];
  const expiringSubs = stats?.expiring_subscriptions ?? [];
  const recentPayments = stats?.recent_payments ?? [];
  const promoPlans = stats?.promo_plans ?? [];

  const currentMonthName = MONTHS[new Date().getMonth()];

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Admin Dashboard</p>
        <h1 className="text-3xl font-extrabold text-[#03023B]">Welcome back, {user.name}</h1>
      </div>

      {/* ── Top KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Members"     value={m.total_active}     sub="currently active" />
        <StatCard label="Annual Members"     value={m.annual}           sub="with annual plan" />
        <StatCard label="Walk-in Members"    value={m.walk_in}          sub="walk-in type" />
        <StatCard label="New This Month"     value={m.new_this_month}   sub={`joined in ${currentMonthName}`} accent="text-emerald-600" />
      </div>

      {/* ── Revenue Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

        {/* Revenue Cards */}
        <div className="flex flex-col gap-4">
          <StatCard
            label="Monthly Revenue"
            value={`₱${(rev.monthly_total ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
            sub={`${currentMonthName} total`}
            accent="text-[#B63C2C]"
          />
          <StatCard
            label="Annual Revenue"
            value={`₱${(rev.annual_total ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
            sub={`${new Date().getFullYear()} total`}
            accent="text-[#03023B]"
          />
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Revenue — {new Date().getFullYear()}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#03023B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#03023B" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₱${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <Tooltip
                formatter={v => [`₱${Number(v).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, 'Revenue']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="value" stroke="#03023B" strokeWidth={2}
                fill="url(#revGrad)" dot={{ r: 3, fill: '#03023B' }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Expiring + Recent Payments Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

        {/* Expiring Memberships */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionTitle>Expiring Memberships</SectionTitle>
          {expiringMemberships.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">None expiring soon 🎉</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {expiringMemberships.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#03023B]">{m.member_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{m.type} · {m.end_date}</p>
                  </div>
                  <DaysLeftBadge days={m.days_left} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Training Subs */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionTitle>Expiring Subscriptions</SectionTitle>
          {expiringSubs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">None expiring soon 🎉</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {expiringSubs.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#03023B]">{s.member_name}</p>
                    <p className="text-xs text-gray-400">{s.plan_name} · {s.end_date}</p>
                  </div>
                  <DaysLeftBadge days={s.days_left} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionTitle>Recent Payments</SectionTitle>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No payments yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#03023B]">{p.member_name}</p>
                    <p className="text-xs text-gray-400">{p.payment_date} {p.payment_method ? `· ${p.payment_method}` : ''}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    ₱{Number(p.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Promo Plan Slots ── */}
      {promoPlans.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Promo Plan Slots</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoPlans.map((plan, i) => {
              const pct = plan.max_slots > 0 ? (plan.used_slots / plan.max_slots) * 100 : 0;
              const barColor = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-emerald-500';
              return (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-bold text-[#03023B] mb-1 truncate">{plan.name}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {plan.used_slots} / {plan.max_slots} slots used · <span className="font-semibold text-[#03023B]">{plan.slots_left} left</span>
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}