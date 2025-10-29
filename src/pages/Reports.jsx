import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import { reports } from '../data/reports'
import { useEffect, useState } from 'react'

export default function Reports() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Filtres">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="input" placeholder="Recherche site / ID" />
            <input className="input" type="date" />
            <select className="select">
              <option>Statut</option>
              <option>Validé</option>
              <option>En revue</option>
            </select>
            <button className="btn btn-primary">Exporter PDF</button>
          </div>
        </Card>
        <Card title="Rapports">
          <div className="divide-y">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-3">
                  <div className="h-4 w-1/3 skeleton mb-2" />
                  <div className="h-3 w-1/4 skeleton" />
                </div>
              ))
            ) : (
              reports.map(r => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="text-sm">
                    <div className="font-medium">{r.site}</div>
                    <div className="text-gray-600">{r.id}</div>
                  </div>
                  <div className="text-sm flex items-center gap-3">
                    <span className={`badge ${r.status === 'Validé' ? 'badge-green' : r.status === 'En revue' ? 'badge-blue' : 'badge-gray'}`}>{r.status}</span>
                    <span className="text-gray-600">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-sm">
                    <button className="btn btn-outline">Télécharger PDF</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Page>
  )
}
