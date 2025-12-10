interface StatsBoxProps {
  stats: {
    totalIncome: number
    monthlyAverage: number
    highestTransaction: number
    transactionCount: number
  }
  accentColor: string
}

export default function StatisticsBox({ stats, accentColor }: StatsBoxProps) {
  return (
    <div className={`bg-gradient-to-r ${accentColor} to-opacity-20 rounded-lg p-6 mb-6 text-white`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem label="Total Income" value={`$${stats.totalIncome.toFixed(2)}`} />
        <StatItem label="Monthly Average" value={`$${stats.monthlyAverage.toFixed(2)}`} />
        <StatItem label="Highest Transaction" value={`$${stats.highestTransaction.toFixed(2)}`} />
        <StatItem label="Transaction Count" value={stats.transactionCount.toString()} />
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/70 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
