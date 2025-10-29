import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Page from '../components/motion/Page'
import { useMemo, useState } from 'react'
import { antennas as allAntennas } from '../data/antennas'
import { CheckCircle2, Wrench, CalendarDays } from 'lucide-react'

const columns = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Nom du site', sortable: true },
  { key: 'region', title: 'Région', sortable: true },
  { key: 'type', title: 'Type', sortable: true },
  { key: 'status', title: 'Statut', sortable: true, render: (v) => {
    const tone = v === 'Validé' || v === 'Actif' ? 'badge-green' : v === 'En cours' || v === 'Plannifié' ? 'badge-blue' : 'badge-yellow'
    return <span className={`badge ${tone}`}>{v}</span>
  } },
  { key: 'lastInspection', title: 'Dernière inspection', sortable: true, render: (v) => new Date(v).toLocaleDateString('fr-FR') },
  { key: 'actions', title: '', render: (_val, row) => (
    <div className="flex gap-2 justify-end">
      <button className="btn btn-outline px-2 py-1 text-xs">Voir</button>
      <button className="btn btn-outline px-2 py-1 text-xs">Editer</button>
      <button className="btn btn-danger px-2 py-1 text-xs">Supprimer</button>
    </div>
  )},
]

export default function Antennas() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    const base = allAntennas.filter(a => {
      const matchesQ = q ? (a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())) : true
      const matchesStatus = status ? a.status === status : true
      const matchesType = type ? a.type === type : true
      return matchesQ && matchesStatus && matchesType
    })
    if (!sortKey) return base
    return [...base].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (sortKey === 'lastInspection') {
        const ad = new Date(av).getTime()
        const bd = new Date(bv).getTime()
        return sortDir === 'asc' ? ad - bd : bd - ad
      }
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
  }, [q, status, type, sortKey, sortDir])

  // Build visual grid of antenna thumbnails with statuses
  const gallery = useMemo(() => {
    const modules = import.meta.glob('../assets/images/gestionAntennes/*.{jpg,JPG,jpeg,png,webp}', { eager: true, as: 'url' })
    const urls = Object.entries(modules).map(([path, url]) => ({ path, url }))
    const statuses = [
      { label: 'Active', tone: 'badge-green', Icon: CheckCircle2 },
      { label: 'En maintenance', tone: 'badge-yellow', Icon: Wrench },
      { label: 'Planifiée', tone: 'badge-blue', Icon: CalendarDays },
    ]
    function humanize(name) {
      const base = name.replace(/\\\\/g, '/').split('/').pop() || name
      const noExt = base.replace(/\.[^.]+$/, '')
      return noExt.replace(/[_-]+/g, ' ')
    }
    return urls.slice(0, 12).map((it, i) => {
      const s = statuses[i % statuses.length]
      return { name: humanize(it.path), url: it.url, status: s }
    })
  }, [])

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Gestion des antennes</h1>
          <button className="btn btn-primary">Ajouter</button>
        </div>
        <Card title="Filtres">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input className="input h-10" placeholder="Recherche site / ID" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="select h-10" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Statut</option>
              {['Plannifié', 'En cours', 'Validé', 'Actif', 'Maintenance'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select h-10" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Type d'antenne</option>
              {['4G', '5G', 'Radio'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="text-sm text-gray-500 flex items-center justify-start md:justify-end h-10">{filtered.length} résultats</div>
          </div>
        </Card>
        <Card title="Vignettes des antennes">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((a, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img src={a.url} alt={a.name} className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-200" />
                </div>
                <div className="px-3 py-2 text-sm flex items-center justify-between gap-2">
                  <div className="font-medium text-gray-800 truncate" title={a.name}>{a.name}</div>
                  <span className={`badge ${a.status.tone} inline-flex items-center gap-1 whitespace-nowrap`}>
                    <a.status.Icon size={14} /> {a.status.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Table
            columns={columns}
            data={filtered}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={(k, dir) => { setSortKey(k); setSortDir(dir) }}
          />
        </Card>
      </div>
    </Page>
  )
}
