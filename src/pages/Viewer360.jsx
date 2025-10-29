import Card from '../components/ui/Card'
import Viewer360Placeholder from '../components/mock/Viewer360Placeholder'
import Page from '../components/motion/Page'

export default function Viewer360() {
  return (
    <Page>
      <div className="container-page space-y-6">
        <Card title="Visite virtuelle 360°">
          <Viewer360Placeholder />
        </Card>
        <Card title="Vues disponibles">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-500">Vignette</div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  )
}
