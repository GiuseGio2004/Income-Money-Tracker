interface Transaction {
  date: string
  description: string
  amount: number
  type: 'income' | 'refund' | 'fee' | 'withdrawal'
}

interface TransactionTableProps {
  transactions: Transaction[]
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400'
      case 'refund':
        return 'text-orange-600 dark:text-orange-400'
      case 'fee':
        return 'text-red-600 dark:text-red-400'
      case 'withdrawal':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-foreground'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return '📈'
      case 'refund':
        return '↩️'
      case 'fee':
        return '⚠️'
      case 'withdrawal':
        return '💸'
      default:
        return '•'
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
              <td className="px-6 py-4 text-sm text-foreground font-medium">{tx.description}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`${getTypeColor(tx.type)}`}>
                  {getTypeIcon(tx.type)} {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                </span>
              </td>
              <td className={`px-6 py-4 text-sm font-semibold text-right ${
                tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {tx.amount > 0 ? '+' : ''} ${Math.abs(tx.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && (
        <div className="px-6 py-8 text-center text-muted-foreground">
          No transactions found matching your filters.
        </div>
      )}
    </div>
  )
}
