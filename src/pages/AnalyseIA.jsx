import { useEffect, useMemo, useState } from 'react'
import Page from '../components/motion/Page'
import Card from '../components/ui/Card'
import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Wrench, AlertTriangle, Flag } from 'lucide-react'
import LazyImage from '../components/ui/LazyImage'
import ImageOverlay from '../components/ui/ImageOverlay'

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
  // Search + overlay state
  const [q, setQ] = useState('')
  const [imgQ, setImgQ] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeAnalysis, setActiveAnalysis] = useState(null)
  const predefinedAnalyses = ['Analyse Ville01', 'Analyse Ville02', 'Analyse Ville03']
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

  // Load all images from assets/analyseIA
  const allImages = useMemo(() => {
    const modules = import.meta.glob('../assets/images/analyseIA/*.{jpg,JPG,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
    const urls = Object.entries(modules).map(([path, url]) => ({ path, url }))
    function humanize(name) {
      const base = name.replace(/\\\\/g, '/').split('/').pop() || name
      const noExt = base.replace(/\.[^.]+$/, '')
      return noExt.replace(/[_-]+/g, ' ')
    }
    return urls.map(({ path, url }) => ({ name: humanize(path), url }))
  }, [])

  // Partition images into 3 analysis groups (>=12 each)
  const imagesByAnalysis = useMemo(() => {
    const chunkSize = Math.max(12, Math.ceil(allImages.length / 3))
    return {
      'Analyse Ville01': allImages.slice(0, chunkSize),
      'Analyse Ville02': allImages.slice(chunkSize, chunkSize * 2),
      'Analyse Ville03': allImages.slice(chunkSize * 2),
    }
  }, [allImages])

  const anomalyTypes = ['Corrosion', 'Isolateur endommagé', 'Câble desserré', 'Végétation proche', 'Structure fissurée', 'Objet étranger']
  const detectionResults = ['Confiance 0.82', 'Confiance 0.91', 'Confiance 0.74', 'Confiance 0.88', 'Confiance 0.96']

  function confirmAnalysis(name) {
    setActiveAnalysis(name)
    setIsGalleryOpen(true)
    setDropdownOpen(false)
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      const normalized = imgQ.trim().toLowerCase()
      const found = predefinedAnalyses.find(n => n.toLowerCase() === normalized)
      if (found) confirmAnalysis(found)
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
    }
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Analyse IA</h1>
          <button className="px-3 py-2 bg-primary text-white rounded" onClick={simulate}>Simuler l'analyse IA</button>
        </div>

        {/* Search bar (same style/size as Antennas) */}
        <Card title="Recherche d'analyse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="relative">
              <input
                className="input h-10 w-full"
                placeholder="Recherche analyse (ex: Analyse Ville01)"
                value={imgQ}
                onChange={(e) => { setImgQ(e.target.value); setDropdownOpen(true) }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  {predefinedAnalyses
                    .filter(n => n.toLowerCase().includes(imgQ.trim().toLowerCase()))
                    .map(n => (
                      <button
                        key={n}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => confirmAnalysis(n)}
                      >
                        {n}
                      </button>
                    ))}
                  {predefinedAnalyses.filter(n => n.toLowerCase().includes(imgQ.trim().toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">Aucune correspondance</div>
                  )}
                </div>
              )}
            </div>
            <div className="md:col-span-2 text-sm text-gray-500">
              Exemples: Analyse Ville01, Analyse Ville02, Analyse Ville03
            </div>
          </div>
        </Card>

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

        

        <Card title="Données de référence">
          <div className="text-sm text-gray-600">
            <div className="mb-1 font-medium">Régions:</div>
            <div className="mb-3">{regions.join(', ')}</div>
            <div className="mb-1 font-medium">Types d\'antenne:</div>
            <div>{antennaTypes.join(', ')}</div>
          </div>
        </Card>
      </div>

      <ImageOverlay
        open={isGalleryOpen}
        title={activeAnalysis}
        images={(imagesByAnalysis[activeAnalysis] || [])}
        ratioClass="aspect-square"
        getMeta={(_img, idx) => {
          const meta = {
            detection: detectionResults[idx % detectionResults.length],
            height: `${20 + (idx % 30)} m`,
            anomaly: anomalyTypes[idx % anomalyTypes.length],
          }
          return [`${meta.anomaly} · ${meta.height}`, meta.detection]
        }}
        onClose={closeGallery}
      />
    </Page>
  )
}
