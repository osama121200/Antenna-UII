import Page from '../components/motion/Page'
import Card from '../components/ui/Card'

export default function Profile() {
  const user = {
    name: 'Alex Martin',
    role: 'Administrateur',
    email: 'alex.martin@example.com',
    phone: '+33 6 12 34 56 78',
    joined: '12/03/2024',
    avatar: 'https://i.pravatar.cc/160?img=32',
  }

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Profil</h1>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline">Paramètres</button>
            <button className="btn btn-danger">Se déconnecter</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center text-center gap-4">
              <img src={user.avatar} alt={user.name} className="h-28 w-28 rounded-full border border-gray-200 shadow-sm object-cover" />
              <div>
                <div className="text-lg font-semibold">{user.name}</div>
                <div className="text-sm text-gray-600">{user.role}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary">Éditer le profil</button>
                <button className="btn btn-outline">Changer l'avatar</button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2" title="Informations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded border bg-white">
                <div className="text-gray-600">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="p-3 rounded border bg-white">
                <div className="text-gray-600">Téléphone</div>
                <div className="font-medium">{user.phone}</div>
              </div>
              <div className="p-3 rounded border bg-white">
                <div className="text-gray-600">Rôle</div>
                <div className="font-medium">{user.role}</div>
              </div>
              <div className="p-3 rounded border bg-white">
                <div className="text-gray-600">Membre depuis</div>
                <div className="font-medium">{user.joined}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}


