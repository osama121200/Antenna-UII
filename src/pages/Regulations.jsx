import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import { ShieldCheck, CheckCircle2, FileDown } from 'lucide-react'

export default function Regulations() {
  const docs = [
    { name: 'Guide réglementaire DGAC', size: '1.2 MB' },
    { name: 'Procédure autorisations de vol', size: '820 KB' },
    { name: 'Charte confidentialité', size: '540 KB' },
  ]

  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Réglementation & Autorisations">
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <ShieldCheck className="text-primary-600" size={18} />
            <p>Consultez ici les documents légaux, notices, et procédures d'autorisation de vol.</p>
          </div>
        </Card>
        <Card title="Documents">
          <div className="space-y-3">
            {docs.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-sm">{d.name}</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{d.size}</span>
                  <button className="btn btn-outline"><FileDown size={14} className="mr-1"/>Télécharger</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Conformité">
          <ul className="space-y-2 text-sm">
            {['Respect des zones NFZ', 'Plan de vol déposé', 'Assurances à jour'].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Page>
  )
}
