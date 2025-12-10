'use client'

import { useState } from 'react'
import Dashboard from '@/components/dashboard'
import DetailsView from '@/components/details-view'

type ViewType = 'dashboard' | 'mercadopago' | 'cuentadni'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <nav className="w-64 border-r border-border bg-sidebar text-sidebar-foreground p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Income Money Tracker
          </h1>
        </div>

        <div className="space-y-2">
          <NavItem
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </NavItem>
          <NavItem
            active={currentView === 'mercadopago'}
            onClick={() => setCurrentView('mercadopago')}
          >
            💳 MercadoPago
          </NavItem>
          <NavItem
            active={currentView === 'cuentadni'}
            onClick={() => setCurrentView('cuentadni')}
          >
            🏦 CuentaDNI
          </NavItem>
        </div>

      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard onViewDetails={setCurrentView} />}
        {currentView !== 'dashboard' && (
          <DetailsView source={currentView} onBack={() => setCurrentView('dashboard')} />
        )}
      </main>
    </div>
  )
}

function NavItem({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
          : 'hover:bg-sidebar-accent text-sidebar-foreground'
      }`}
    >
      {children}
    </button>
  )
}
