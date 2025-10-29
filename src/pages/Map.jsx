import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import MapView from '../components/map/MapView'
import { useMemo, useState } from 'react'
import { antennas as allAntennas } from '../data/antennas'

export default function Map() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const filtered = useMemo(() => {
    return allAntennas.filter(a => {
      const matchesQ = q ? (a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())) : true
      const matchesStatus = status ? a.status === status : true
      const matchesType = type ? a.type === type : true
      return matchesQ && matchesStatus && matchesType
    })
  }, [q, status, type])

  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Filtres">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input className="input h-10" placeholder="Recherche site / ID" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="select h-10" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Statut</option>
              {['Plannifié', 'En cours', 'Validé', 'Actif', 'Maintenance'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select h-10" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Type d'antenne</option>
              {['4G', '5G', 'Radio'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Card>
        <Card title={`Carte (${filtered.length})`}>
          <MapView items={filtered} />
        </Card>
      </div>
    </Page>
  )
}
