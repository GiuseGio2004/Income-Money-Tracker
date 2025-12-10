'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface IncomeCardProps {
  title: string
  icon: string
  balance: number
  monthlyAverage: number
  trend: number[]
  color: string
  onClick: () => void
}

export default function IncomeCard({
  title,
  icon,
  balance,
  monthlyAverage,
  trend,
  color,
  onClick,
}: IncomeCardProps) {
  const chartData = trend.map((value, index) => ({
    week: `W${index + 1}`,
    amount: value,
  }))

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
    >
      <div className="text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-balance">${balance.toFixed(2)}</h3>
          </div>
          <span className="text-4xl">{icon}</span>
        </div>

        {/* Chart */}
        <div className="mb-6 -mx-6 -mb-6 bg-white/10 rounded-b-2xl p-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <Bar dataKey="amount" fill="rgba(255, 255, 255, 0.7)" radius={[8, 8, 0, 0]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/70">Monthly Avg</p>
            <p className="font-semibold">${monthlyAverage.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70">View Details →</p>
          </div>
        </div>
      </div>
    </div>
  )
}
