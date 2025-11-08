import { useMemo, useState } from 'react'
import Page from '../components/motion/Page'
import Card from '../components/ui/Card'
import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Wrench, AlertTriangle, Flag } from 'lucide-react'
import LazyImage from '../components/ui/LazyImage'

const COLORS = ['#2563eb', '#60a5fa', '#ef4444']

const regions = [
  'Ville06',
  'Ville07',
  'Ville08',
  'Ville09',
  'Ville10',
  'Ville11',
  'Ville12',
  'Ville13',
]

const antennaTypes = ['4G', '5G', 'Radio']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateStatusData() {
  const ok = rand(60, 120)
  const maintenance = rand(10, 40)
  const critical = rand(5, 20)
  return [
    { name: 'OK', value: ok },
    { name: 'Maintenance', value: maintenance },
    { name: 'Critique', value: critical },
  ]
}

function generateDefectsByRegion() {
  return regions.map(r => ({ name: r, defauts: rand(0, 30) }))
}

function generateInspectionTrend() {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  return months.map(m => ({ name: m, inspections: rand(20, 80) }))
}

function generateInsights() {
  const candidates = [
    'Anomalies de corrosion en hausse dans les zones côtières.',
    'Antennes 5G en Ville06 présentent +12% de risque ce mois.',
    'Baisse anormale du signal détectée sur 3 sites.',
    'Végétation proche détectée: inspection recommandée sous 7 jours.',
    'Taux de défauts inférieur à la moyenne nationale en Ville11.',
  ]
  const n = rand(2, 4)
  const picks = new Set()
  while (picks.size < n) picks.add(candidates[rand(0, candidates.length - 1)])
  return Array.from(picks)
}

export default function AnalyseIA() {
  const [statusData, setStatusData] = useState(generateStatusData())
  const [regionDefects, setRegionDefects] = useState(generateDefectsByRegion())
  const [trend, setTrend] = useState(generateInspectionTrend())
  const [insights, setInsights] = useState(generateInsights())
  const dataKey = useMemo(() => Date.now(), [statusData, regionDefects, trend])

  const totals = useMemo(() => {
    const ok = statusData.find(d => d.name === 'OK')?.value || 0
    const maintenance = statusData.find(d => d.name === 'Maintenance')?.value || 0
    const critical = statusData.find(d => d.name === 'Critique')?.value || 0
    return { ok, maintenance, critical }
  }, [statusData])

  function simulate() {
    setStatusData(generateStatusData())
    setRegionDefects(generateDefectsByRegion())
    setTrend(generateInspectionTrend())
    setInsights(generateInsights())
  }

  const suggestedMaintenance = totals.maintenance
  const predictedFailures = Math.max(1, Math.round(totals.critical * 0.3))
  const priorityActions = Math.max(1, Math.round((totals.maintenance + totals.critical) * 0.2))

  // Load showcase images from assets and attach sample AI categories (default Vite ?url behavior)
  const analysedItems = useMemo(() => {
    const modules = import.meta.glob('../assets/images/analyseIA/*.{jpg,JPG,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
    const urls = Object.values(modules)
    const categories = [
      'Corrosion détectée',
      'Isolateur endommagé',
      'Câble desserré',
      'Végétation proche',
      'Structure fissurée',
      'Objets étrangers',
      'Équipement manquant',
      'Débris sur site',
    ]
    return urls.slice(0, 12).map((url, i) => ({ url, label: categories[i % categories.length] }))
  }, [])

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Analyse IA</h1>
          <button className="px-3 py-2 bg-primary text-white rounded" onClick={simulate}>Simuler l'analyse IA</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Statut des antennes">
            <motion.div key={`pie-${dataKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </Card>

          <Card title="Taux de défauts par région">
            <motion.div key={`bar-${dataKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionDefects} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="defauts" name="Défauts" fill="#2563eb" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </Card>

          <Card title="Tendance des inspections">
            <motion.div key={`line-${dataKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="inspections" name="Inspections" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </Card>
        </div>

        <Card title="Insights IA">
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
            {insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="p-2 rounded-md bg-blue-50 text-blue-700"><Wrench size={18} /></div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Maintenance suggérée</div>
                <div className="text-xl font-semibold">{suggestedMaintenance}</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="p-2 rounded-md bg-amber-50 text-amber-700"><AlertTriangle size={18} /></div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Pannes prédites</div>
                <div className="text-xl font-semibold">{predictedFailures}</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-700"><Flag size={18} /></div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Actions prioritaires</div>
                <div className="text-xl font-semibold">{priorityActions}</div>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Exemples analysés (IA)">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {analysedItems.map((it, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <LazyImage
                  src={it.url}
                  alt={it.label}
                  ratioClass="aspect-video"
                  imgClassName="transform group-hover:scale-[1.03] transition-transform duration-200"
                />
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium text-gray-800">{it.label}</div>
                  <div className="text-xs text-gray-600">Classification IA</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Données de référence">
          <div className="text-sm text-gray-600">
            <div className="mb-1 font-medium">Régions:</div>
            <div className="mb-3">{regions.join(', ')}</div>
            <div className="mb-1 font-medium">Types d\'antenne:</div>
            <div>{antennaTypes.join(', ')}</div>
          </div>
        </Card>
      </div>
    </Page>
  )
}
