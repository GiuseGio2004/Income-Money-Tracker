'use client'

import { useState, useMemo, useEffect } from 'react'
import TransactionTable from './transaction-table'
import StatisticsBox from './statistics-box'

interface Transaction {
  date: string
  description: string
  amount: number
  type: 'income' | 'refund' | 'fee' | 'withdrawal'
}

interface DetailsViewProps {
  source: 'mercadopago' | 'cuentadni'
  onBack: () => void
}

export default function DetailsView({ source, onBack }: DetailsViewProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyAverage: 0,
    highestTransaction: 0,
    transactionCount: 0,
  })

  const isMP = source === 'mercadopago'
  const title = isMP ? 'MercadoPago' : 'CuentaDNI'
  const icon = isMP ? '💳' : '🏦'
  const accentColor = isMP ? 'bg-primary' : 'bg-secondary'

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const ENV = (process as any)?.env as any
        const base = (ENV?.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000'
        const url = `${base}/api/ingresos/${source}?dias=30`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const tx: Transaction[] = (data.movimientos || []).map((m: any) => ({
          date: (m.fecha || '').slice(0, 10),
          description: m.descripcion || 'Sin descripción',
          amount: Number(m.monto || 0),
          type: m.tipo === 'ingreso' ? 'income' : 'withdrawal' as const,
        }))
        setAllTransactions(tx)
        const totalIncome = tx
          .filter((t: { amount: number }) => t.amount > 0)
          .reduce((s: number, t: { amount: number }) => s + t.amount, 0)
        const highest = tx.length
          ? Math.max(...tx.map((t: { amount: number }) => Math.abs(t.amount)))
          : 0
        setStats({
          totalIncome,
          monthlyAverage: 0,
          highestTransaction: highest,
          transactionCount: tx.length,
        })
      } catch (e: unknown) {
        // safest way to extract message
        const err = e as { name?: string; message?: string }
        if (err?.name !== 'AbortError') setError(err?.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [source])

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction: { description: string; type: string }) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || transaction.type === filterType
      return matchesSearch && matchesType
    })
  }, [searchTerm, filterType])

  const loadingOrError = (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {loading && <p className="text-muted-foreground">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-accent/20 text-foreground transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold">
          <span className="mr-3">{icon}</span>
          {title} Transactions
        </h2>
      </div>

      {/* Statistics Box */}
      <StatisticsBox stats={stats} accentColor={accentColor} />

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="refund">Refund</option>
              <option value="fee">Fee</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-muted-foreground mb-2">Search Description</label>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {(loading || error) && loadingOrError}
      {/* Transactions Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  )
}

