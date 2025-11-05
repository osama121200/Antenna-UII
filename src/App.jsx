import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Map = lazy(() => import('./pages/Map'))
const Antennas = lazy(() => import('./pages/Antennas'))
const AIAnalytics = lazy(() => import('./pages/AIAnalytics'))
const Viewer360 = lazy(() => import('./pages/Viewer360'))
const Reports = lazy(() => import('./pages/Reports'))
const Regulations = lazy(() => import('./pages/Regulations'))
const Collaboration = lazy(() => import('./pages/Collaboration'))
const Security = lazy(() => import('./pages/Security'))
// Removed pages
const AnalyseIA = lazy(() => import('./pages/AnalyseIA'))
const Profile = lazy(() => import('./pages/Profile'))

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="container-page"><Spinner label="Chargement de la page…" /></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/antennas" element={<Antennas />} />
          <Route path="/ai" element={<AnalyseIA />} />
          <Route path="/viewer-old" element={<Viewer360 />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/regulations" element={<Regulations />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/security" element={<Security />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
