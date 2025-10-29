import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Radio, BrainCircuit, Cuboid, FileText, ShieldCheck, Users, Lock, CalendarDays } from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/map', label: 'Cartographie', icon: Map },
  { to: '/antennas', label: 'Gestion Antennes', icon: Radio },
  { to: '/ai', label: 'Analyse IA', icon: BrainCircuit },
  { to: '/viewer', label: 'Visite 360°', icon: Cuboid },
  { to: '/reports', label: 'Rapports', icon: FileText },
  { to: '/regulations', label: 'Réglementation', icon: ShieldCheck },
  { to: '/collaboration', label: 'Communication', icon: Users },
  { to: '/security', label: 'Sécurité', icon: Lock },
  { to: '/demo', label: 'Demande de Démo', icon: CalendarDays },
]

export default function Sidebar({ onNavigate }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 border-b">
        <div className="text-primary font-semibold">Antennes Drone</div>
        <div className="text-xs text-gray-500">Solution Inspection</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {nav.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 text-primary-700' : 'text-gray-700'}`
              }
              onClick={onNavigate}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
      <div className="p-3 text-xs text-gray-500 border-t">v0.1.0</div>
    </div>
  )
}
