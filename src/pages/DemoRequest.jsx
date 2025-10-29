import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import { useState } from 'react'

export default function DemoRequest() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Demande de démo">
          {sent ? (
            <div className="p-4 rounded border border-green-200 bg-green-50 text-green-700 text-sm">Merci ! Nous vous recontacterons très bientôt pour planifier la démo.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  const name = fd.get('name')?.toString().trim()
                  const email = fd.get('email')?.toString().trim()
                  const org = fd.get('org')?.toString().trim()
                  const need = fd.get('need')?.toString().trim()
                  const errs = {}
                  if (!name) errs.name = 'Requis'
                  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email invalide'
                  if (!org) errs.org = 'Requis'
                  if (!need) errs.need = 'Requis'
                  setErrors(errs)
                  if (Object.keys(errs).length === 0) setSent(true)
                }}
              >
                <div>
                  <input name="name" className={`input ${errors.name ? 'border-red-300 ring-2 ring-red-200' : ''}`} placeholder="Nom et prénom" />
                  {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                </div>
                <div>
                  <input name="email" className={`input ${errors.email ? 'border-red-300 ring-2 ring-red-200' : ''}`} type="email" placeholder="Email" />
                  {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                </div>
                <div>
                  <input name="org" className={`input ${errors.org ? 'border-red-300 ring-2 ring-red-200' : ''}`} placeholder="Organisation" />
                  {errors.org && <div className="text-xs text-red-600 mt-1">{errors.org}</div>}
                </div>
                <div>
                  <textarea name="need" className={`textarea ${errors.need ? 'border-red-300 ring-2 ring-red-200' : ''}`} rows="4" placeholder="Votre besoin"></textarea>
                  {errors.need && <div className="text-xs text-red-600 mt-1">{errors.need}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">
                    <input type="checkbox" className="mr-2 align-middle" />
                    J'accepte d'être recontacté par email.
                  </label>
                  <button className="btn btn-primary">Envoyer</button>
                </div>
              </form>
              <div>
                <div className="text-sm text-gray-600 mb-2">Disponibilités</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-16 border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">Créneau</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Page>
  )
}
