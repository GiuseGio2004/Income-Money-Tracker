'use client'

import { useState } from 'react'
import IncomeCard from './income-card'
import ThemeToggle from './theme-toggle'

interface DashboardProps {
  onViewDetails: (source: 'mercadopago' | 'cuentadni') => void
}

export default function Dashboard({ onViewDetails }: DashboardProps) {
  const [isDark, setIsDark] = useState(false)

  const handleThemeToggle = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const mercadopagoData = {
    balance: 15420.50,
    monthlyAverage: 2800,
    trend: [2400, 2800, 2500, 3200, 2900, 3100, 3500],
  }

  const cuentadniData = {
    balance: 8750.25,
    monthlyAverage: 1850,
    trend: [1500, 1800, 1600, 2100, 1900, 2000, 2250],
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-balance">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Here's your income overview</p>
        </div>
        <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
      </div>

      {/* Income Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <IncomeCard
          title="MercadoPago"
          icon="💳"
          balance={mercadopagoData.balance}
          monthlyAverage={mercadopagoData.monthlyAverage}
          trend={mercadopagoData.trend}
          color="from-primary to-blue-500"
          onClick={() => onViewDetails('mercadopago')}
        />
        <IncomeCard
          title="CuentaDNI"
          icon="🏦"
          balance={cuentadniData.balance}
          monthlyAverage={cuentadniData.monthlyAverage}
          trend={cuentadniData.trend}
          color="from-secondary to-green-500"
          onClick={() => onViewDetails('cuentadni')}
        />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Income" value={`$${(mercadopagoData.balance + cuentadniData.balance).toFixed(2)}`} />
        <StatCard label="Combined Monthly Avg" value={`$${(mercadopagoData.monthlyAverage + cuentadniData.monthlyAverage).toFixed(2)}`} />
        <StatCard label="This Month (MP)" value={`$${mercadopagoData.trend[6].toFixed(2)}`} />
        <StatCard label="This Month (DNI)" value={`$${cuentadniData.trend[6].toFixed(2)}`} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
