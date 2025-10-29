import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import PieSimple from '../components/charts/PieSimple'
import BarSimple from '../components/charts/BarSimple'
import { anomalyBreakdown, modelAccuracy, maintenanceRates } from '../data/analytics'
import { useEffect, useMemo, useState } from 'react'

export default function AIAnalytics() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(t => (t + 1) % 4), 3000)
    return () => clearInterval(t)
  }, [])

  const rollingAccuracy = useMemo(() => {
    const delta = (tick % 2 === 0) ? 0.002 : -0.002
    return modelAccuracy.map(d => ({ ...d, precision: Math.max(0, Math.min(1, d.precision + delta)) }))
  }, [tick])

  const insights = [
    'Anomalie de corrosion détectée sur 3 sites',
    'Défaut d\'alignement probable - 2 antennes',
    'Risque de végétation proche - 5 sites',
  ]

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Précision modèle">
            <BarSimple data={rollingAccuracy} dataKey="precision" name="Précision" valueFormatter={(v) => `${Math.round(v * 100)}%`} xAngle={0} />
          </Card>
          <Card title="Types d'anomalies">
            <PieSimple data={anomalyBreakdown} valueFormatter={(v) => v} />
          </Card>
          <Card title="Taux de maintenance">
            <BarSimple data={maintenanceRates} dataKey="rate" name="Taux" valueFormatter={(v) => `${Math.round(v * 100)}%`} xAngle={0} />
          </Card>
        </div>

        <Card title="Insights IA">
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
            {insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </Card>
      </div>
    </Page>
  )
}
