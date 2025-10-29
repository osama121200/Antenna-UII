import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Root wrapper */}
      <div className="min-h-screen w-full">
        {/* Mobile overlay */}
        <div className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)} />

        {/* Sidebar (fixed on mobile, visible on md+) */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-emphasized ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </aside>

        {/* Content column offset by sidebar on md+ */}
        <div className="ml-0 md:ml-[260px] min-h-screen flex flex-col">
          <header className="h-14 bg-white border-b border-gray-200 w-full relative z-50">
            <Topbar onMenu={() => setOpen((v) => !v)} />
          </header>
          <main className="flex-1 min-h-0 overflow-auto w-full flex flex-col">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </>
  )
}
