import { Activity, MapPinned, SignalHigh, FileText } from 'lucide-react'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import MapView from '../components/map/MapView'
import Page from '../components/motion/Page'
import AreaTrend from '../components/charts/AreaTrend'
import { activityTrend } from '../data/analytics'
import { antennas } from '../data/antennas'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [counter, setCounter] = useState({ flights: 312, zones: 76, reports: 542 })
  useEffect(() => {
    const t = setInterval(() => {
      setCounter((c) => ({
        flights: c.flights + Math.floor(Math.random() * 2),
        zones: c.zones + Math.floor(Math.random() * 1),
        reports: c.reports + Math.floor(Math.random() * 3),
      }))
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const stats = [
    { label: 'Antennes suivies', value: antennas.length.toString(), hint: '+4.2% ce mois', icon: SignalHigh },
    { label: 'Vols réalisés', value: String(counter.flights), hint: '+8 vols cette semaine', icon: Activity },
    { label: 'Zones cartographiées', value: String(counter.zones), hint: '12 en cours', icon: MapPinned },
    { label: 'Rapports générés', value: String(counter.reports), hint: '18 nouveaux', icon: FileText },
  ]

  const recentReports = [
    { id: 'R-2025-091', site: 'Antenne A12 - Lyon', date: '05/10/2025', status: 'Validé' },
    { id: 'R-2025-090', site: 'Antenne B07 - Nantes', date: '04/10/2025', status: 'En revue' },
    { id: 'R-2025-089', site: 'Antenne C19 - Lille', date: '03/10/2025', status: 'Validé' },
  ]

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <Card title="Carte des interventions" className="lg:col-span-2">
            <MapView items={antennas} zoom={5} />
          </Card>
          <Card title="Tendance activité">
            <AreaTrend data={activityTrend} valueFormatter={(v) => v} />
          </Card>
        </div>

        <Card title="Rapports récents">
          <div className="divide-y">
            {recentReports.map(r => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div className="text-sm">
                  <div className="font-medium">{r.site}</div>
                  <div className="text-gray-600">{r.id}</div>
                </div>
                <div className="text-sm text-gray-600">{r.date}</div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  )
}
