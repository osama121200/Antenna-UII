import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Page from '../components/motion/Page'
import { useEffect, useMemo, useState } from 'react'
import { antennas as allAntennas } from '../data/antennas'
import { CheckCircle2, Wrench, CalendarDays } from 'lucide-react'
import AntennaPlanDynamic from '../components/antennas/AntennaPlanDynamic'
import ImageOverlay from '../components/ui/ImageOverlay'

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeAntenna, setActiveAntenna] = useState(null)
  const [imgQ, setImgQ] = useState('')
  const [imgDropdownOpen, setImgDropdownOpen] = useState(false)

  const predefinedAntennaNames = ['Antenne Ville01', 'Antenne Ville02', 'Antenne Ville03']

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

  // Build list of all images from the gestionAntennes folder
  const allImages = useMemo(() => {
    const modules = import.meta.glob('../assets/images/gestionAntennes/*.{jpg,JPG,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
    const urls = Object.entries(modules).map(([path, url]) => ({ path, url }))
    function humanize(name) {
      const base = name.replace(/\\\\/g, '/').split('/').pop() || name
      const noExt = base.replace(/\.[^.]+$/, '')
      return noExt.replace(/[_-]+/g, ' ')
    }
    return urls.map((it) => ({ name: humanize(it.path), url: it.url }))
  }, [])

  // Partition images among the three predefined antennas (>=12 each)
  const imagesByAntenna = useMemo(() => {
    const chunkSize = Math.max(12, Math.ceil(allImages.length / 3))
    return {
      'Antenne Ville01': allImages.slice(0, chunkSize),
      'Antenne Ville02': allImages.slice(chunkSize, chunkSize * 2),
      'Antenne Ville03': allImages.slice(chunkSize * 2),
    }
  }, [allImages])

  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  function confirmAntenna(name) {
    setActiveAntenna(name)
    setIsGalleryOpen(true)
    setImgDropdownOpen(false)
  }

  function handleImageSearchKeyDown(e) {
    if (e.key === 'Enter') {
      const normalized = imgQ.trim().toLowerCase()
      const found = predefinedAntennaNames.find(n => n.toLowerCase() === normalized)
      if (found) confirmAntenna(found)
    } else if (e.key === 'Escape') {
      setImgDropdownOpen(false)
    }
  }

  

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

        {/* Recherche images antennes */}
        <Card title="Recherche images d'antenne">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start relative">
            <div className="relative">
              <input
                className="input h-10 w-full"
                placeholder="Recherche (ex: Antenne Ville01)"
                value={imgQ}
                onChange={(e) => { setImgQ(e.target.value); setImgDropdownOpen(true) }}
                onFocus={() => setImgDropdownOpen(true)}
                onKeyDown={handleImageSearchKeyDown}
              />
              {imgDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  {predefinedAntennaNames
                    .filter(n => n.toLowerCase().includes(imgQ.trim().toLowerCase()))
                    .map(n => (
                      <button
                        key={n}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => confirmAntenna(n)}
                      >
                        {n}
                      </button>
                    ))
                  }
                  {predefinedAntennaNames.filter(n => n.toLowerCase().includes(imgQ.trim().toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">Aucune correspondance</div>
                  )}
                </div>
              )}
            </div>
            <div className="md:col-span-2 text-sm text-gray-500">
              Exemples: Antenne Ville01, Antenne Ville02, Antenne Ville03
            </div>
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

        <section className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Plan d’antenne interactif</h2>
          <AntennaPlanDynamic />
        </section>
      </div>

      <ImageOverlay
        open={isGalleryOpen}
        title={activeAntenna}
        images={(imagesByAntenna[activeAntenna] || [])}
        ratioClass="aspect-square"
        getMeta={(_img, idx) => [`#${idx + 1}`]}
        onClose={closeGallery}
      />
    </Page>
  )
}
