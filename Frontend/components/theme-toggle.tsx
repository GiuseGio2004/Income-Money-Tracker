interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 rounded-lg bg-muted hover:bg-accent/20 text-foreground transition-colors font-medium"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
