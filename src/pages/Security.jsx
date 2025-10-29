import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import { useState } from 'react'

export default function Security() {
  const [mfa, setMfa] = useState(false)
  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Accès utilisateurs">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Admin</span>
              <button className="btn btn-outline">Gérer</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Opérateur</span>
              <button className="btn btn-outline">Gérer</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Lecteur</span>
              <button className="btn btn-outline">Gérer</button>
            </div>
          </div>
        </Card>
        <Card title="Sécurité & MFA">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Activer l\'authentification multi-facteurs</span>
            <button className={`btn ${mfa ? 'btn-outline' : 'btn-primary'}`} onClick={() => setMfa(v => !v)}>
              {mfa ? 'Désactiver' : 'Activer'}
            </button>
          </div>
          {mfa && (
            <div className="mt-3 text-sm text-gray-700">
              MFA activé. Un code de configuration a été envoyé à votre email.
            </div>
          )}
        </Card>
      </div>
    </Page>
  )
}
