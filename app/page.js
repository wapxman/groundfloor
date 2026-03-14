'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3001'

const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n))

function Sidebar({ active, setActive }) {
  const nav = [
    { id: 'dashboard', label: 'Дашборд' },
    { id: 'properties', label: 'Объекты' },
    { id: 'transactions', label: 'Транзакции' },
    { id: 'owners', label: 'Владельцы' },
    { id: 'report', label: 'Отчёты' },
  ]
  return (
    <aside style={{
      width: 220, background: 'var(--surface)', borderRight: '0.5px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '28px 0', flexShrink: 0, minHeight: '100vh'
    }}>
      <div style={{ padding: '0 20px 32px', fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
        Ground<span style={{ color: 'var(--text-tertiary)' }}>Floor</span>
      </div>
      {nav.map(n => (
        <button key={n.id} onClick={() => setActive(n.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px',
          fontSize: 13, color: active === n.id ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: active === n.id ? 'var(--bg)' : 'transparent',
          border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-main)',
          fontWeight: active === n.id ? 500 : 400, width: '100%',
          borderLeft: active === n.id ? '2px solid var(--text-primary)' : '2px solid transparent',
        }}>
          {n.label}
        </button>
      ))}
    </aside>
  )
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '20px 20px 16px'
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: color || 'var(--text-primary)', letterSpacing: '-0.8px', fontFamily: 'var(--font-mono)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function Badge({ status }) {
  const map = {
    rented: { label: 'Сдаётся', bg: 'var(--green-bg)', color: 'var(--green)' },
    vacant: { label: 'Свободен', bg: '#F5F4F0', color: 'var(--text-secondary)' },
    renovation: { label: 'Ремонт', bg: '#FFF8EC', color: '#9A6A00' },
  }
  const s = map[status] || map.vacant
  return (
    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500 }}>
      {s.label}
    </span>
  )
}

function Dashboard({ properties, transactions }) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const profit = income - expense

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.5px' }}>Март 2026</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>Сводка по всем объектам</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        <MetricCard label="Доходы" value={fmt(income) + ' сум'} sub="за месяц" color="var(--green)" />
        <MetricCard label="Расходы" value={fmt(expense) + ' сум'} sub="за месяц" color="var(--red)" />
        <MetricCard label="Чистая прибыль" value={fmt(profit) + ' сум'} sub="за месяц" />
      </div>

      <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Объекты</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
        {properties.map(p => {
          const pIncome = transactions.filter(t => t.property_id === p.id && t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
          const pExpense = transactions.filter(t => t.property_id === p.id && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
          const pProfit = pIncome - pExpense
          return (
            <div key={p.id} style={{
              background: 'var(--surface)', border: '0.5px solid var(--border)',
              borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.15s'
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14 }}>{p.address}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge status={p.status} />
                {pProfit !== 0 && (
                  <span style={{ fontSize: 13, fontWeight: 500, color: pProfit > 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                    {pProfit > 0 ? '+' : ''}{fmt(pProfit)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Последние транзакции</div>
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 70px 110px', gap: 8, padding: '9px 18px', background: 'var(--bg)', fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          <span>Описание</span><span>Объект</span><span>Дата</span><span style={{ textAlign: 'right' }}>Сумма</span>
        </div>
        {transactions.slice(0, 6).map((t, i) => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 130px 70px 110px', gap: 8,
            padding: '12px 18px', alignItems: 'center', fontSize: 13,
            borderTop: i > 0 ? '0.5px solid var(--border-soft)' : 'none'
          }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.note || t.category}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{t.category}</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.property_name}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}</span>
            <span style={{ textAlign: 'right', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 13, color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
              {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Properties({ properties, onAdd }) {
  const [form, setForm] = useState({ name: '', address: '', type: 'apartment', status: 'rented' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.name || !form.address) return
    setSaving(true)
    await axios.post(`${API}/api/properties`, form)
    setForm({ name: '', address: '', type: 'apartment', status: 'rented' })
    setSaving(false)
    onAdd()
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.5px' }}>Объекты</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>{properties.length} объектов в портфеле</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14, color: 'var(--text-secondary)' }}>Добавить объект</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <input placeholder="Название" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
          <input placeholder="Адрес" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="apartment">Квартира</option>
            <option value="office">Офис</option>
            <option value="warehouse">Склад</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="rented">Сдаётся</option>
            <option value="vacant">Свободен</option>
            <option value="renovation">Ремонт</option>
          </select>
        </div>
        <button onClick={save} disabled={saving} style={{
          padding: '9px 20px', background: 'var(--text-primary)', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-main)'
        }}>{saving ? 'Сохранение...' : 'Добавить'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {properties.map(p => (
          <div key={p.id} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14 }}>{p.address}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge status={p.status} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {p.type === 'apartment' ? 'Квартира' : p.type === 'office' ? 'Офис' : 'Склад'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Transactions({ transactions, properties, onAdd }) {
  const [form, setForm] = useState({ property_id: '', date: new Date().toISOString().split('T')[0], amount: '', type: 'income', category: 'rent', note: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.property_id || !form.amount) return
    setSaving(true)
    await axios.post(`${API}/api/transactions`, form)
    setForm({ ...form, amount: '', note: '' })
    setSaving(false)
    onAdd()
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.5px' }}>Транзакции</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>{transactions.length} операций</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14, color: 'var(--text-secondary)' }}>Добавить транзакцию</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <select value={form.property_id} onChange={e => setForm({ ...form, property_id: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="">Выберите объект</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="rent">Аренда</option>
            <option value="utilities">Коммуналка</option>
            <option value="repair">Ремонт</option>
            <option value="cleaning">Клининг</option>
            <option value="tax">Налоги</option>
            <option value="penalty">Пени</option>
          </select>
          <input type="number" placeholder="Сумма (сум)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
          <input placeholder="Комментарий" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
        <button onClick={save} disabled={saving} style={{
          padding: '9px 20px', background: 'var(--text-primary)', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-main)'
        }}>{saving ? 'Сохранение...' : 'Добавить'}</button>
      </div>

      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 70px 110px', gap: 8, padding: '9px 18px', background: 'var(--bg)', fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          <span>Описание</span><span>Объект</span><span>Дата</span><span style={{ textAlign: 'right' }}>Сумма</span>
        </div>
        {transactions.map((t, i) => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 130px 70px 110px', gap: 8,
            padding: '12px 18px', alignItems: 'center', fontSize: 13,
            borderTop: i > 0 ? '0.5px solid var(--border-soft)' : 'none'
          }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t.note || t.category}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{t.category}</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.property_name}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}</span>
            <span style={{ textAlign: 'right', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 13, color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
              {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Report({ properties, transactions }) {
  const [propId, setPropId] = useState('')
  const filtered = propId ? transactions.filter(t => t.property_id === propId) : transactions
  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const profit = income - expense

  const shares = propId ? [] : []

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.5px' }}>Отчёт P&L</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>Март 2026</p>
      </div>

      <select value={propId} onChange={e => setPropId(e.target.value)}
        style={{ padding: '9px 12px', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', marginBottom: 24, minWidth: 200 }}>
        <option value="">Все объекты</option>
        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <MetricCard label="Доходы" value={fmt(income) + ' сум'} color="var(--green)" />
        <MetricCard label="Расходы" value={fmt(expense) + ' сум'} color="var(--red)" />
        <MetricCard label="NOI" value={fmt(profit) + ' сум'} />
      </div>

      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '0.5px solid var(--border)', fontSize: 13, fontWeight: 500 }}>Детализация по категориям</div>
        {['rent', 'utilities', 'repair', 'cleaning', 'tax', 'penalty'].map(cat => {
          const catTx = filtered.filter(t => t.category === cat)
          if (!catTx.length) return null
          const total = catTx.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)
          return (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderTop: '0.5px solid var(--border-soft)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
              <span style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', color: total >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {total >= 0 ? '+' : ''}{fmt(total)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const [active, setActive] = useState('dashboard')
  const [properties, setProperties] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        axios.get(`${API}/api/properties`),
        axios.get(`${API}/api/transactions`)
      ])
      setProperties(p.data)
      setTransactions(t.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: 900 }}>
        {loading ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 14, marginTop: 40 }}>Загрузка...</div>
        ) : (
          <>
            {active === 'dashboard' && <Dashboard properties={properties} transactions={transactions} />}
            {active === 'properties' && <Properties properties={properties} onAdd={load} />}
            {active === 'transactions' && <Transactions transactions={transactions} properties={properties} onAdd={load} />}
            {active === 'report' && <Report properties={properties} transactions={transactions} />}
            {active === 'owners' && <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Раздел владельцев — скоро</div>}
          </>
        )}
      </main>
    </div>
  )
}
