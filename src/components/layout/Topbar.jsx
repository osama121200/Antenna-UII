import { Bell, UserCircle2, Search, Menu, AlertTriangle, CheckCircle2, MessageSquare, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

export default function Topbar({ onMenu }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnseen, setHasUnseen] = useState(true)
  const notifWrapRef = useRef(null)
  const profileWrapRef = useRef(null)
  const notifications = [
    { id: 1, type: 'alert', title: "Anomalie détectée", message: "Antenne 08 présente un défaut de signal.", time: "il y a 2 min", unread: true },
    { id: 2, type: 'message', title: "Nouveau commentaire", message: "Analyste a ajouté une note au rapport R-2025-090.", time: "il y a 18 min", unread: false },
    { id: 3, type: 'success', title: "Inspection terminée", message: "Drone A12 a terminé l'inspection du Site 45.", time: "il y a 1 h", unread: false },
  ]

  useEffect(() => {
    function handleDocMouseDown(e) {
      if (notifOpen && notifWrapRef.current && !notifWrapRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
      if (open && profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleDocMouseDown)
    return () => document.removeEventListener('mousedown', handleDocMouseDown)
  }, [notifOpen, open])

  return (
    <div className="h-full flex items-center justify-between px-4 gap-3">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 hover:bg-gray-100 rounded" onClick={onMenu}>
          <Menu size={18} />
          <span className="sr-only">Menu</span>
        </button>
        <div className="font-semibold hidden sm:block text-base md:text-lg leading-tight">Solution Inspection Antennes par Drone</div>
      </div>
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="hidden md:flex items-center gap-2 w-full max-w-lg">
          <div className="flex items-center h-10 w-full rounded-md border border-gray-300 bg-white pl-3 pr-3 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-400">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              className="w-full bg-transparent text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 border-0 pl-2"
              placeholder="Rechercher"
              aria-label="Rechercher"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="relative" ref={notifWrapRef}>
          <button
            className="relative p-2 hover:bg-gray-100 rounded"
            onClick={() => {
              setNotifOpen(o => !o)
              setHasUnseen(false)
              setOpen(false)
            }}
            aria-haspopup="true"
            aria-expanded={notifOpen}
          >
            <Bell size={18} />
            {hasUnseen && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500"></span>}
            <span className="sr-only">Notifications</span>
          </button>
          {/* Animated notifications popover with sample items */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-[360px] max-w-[85vw] bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-2xl z-[10001] overflow-hidden"
              >
                <div className="px-4 py-3 text-sm font-semibold border-b">Notifications</div>
                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {notifications.map(n => {
                    const iconCfg = n.type === 'alert'
                      ? { Icon: AlertTriangle, cls: 'bg-amber-50 text-amber-700' }
                      : n.type === 'success'
                        ? { Icon: CheckCircle2, cls: 'bg-green-50 text-green-700' }
                        : { Icon: MessageSquare, cls: 'bg-blue-50 text-blue-700' }
                    const { Icon, cls } = iconCfg
                    return (
                      <div key={n.id} className={`group relative flex items-start gap-3 p-3 rounded-md border border-gray-200 bg-white hover:shadow-md transition-shadow ${n.unread ? 'ring-1 ring-primary-200' : ''}`}>
                        {n.unread && <span className="absolute left-0 top-3 h-4 w-1 rounded bg-primary-500"></span>}
                        <div className={`h-9 w-9 flex items-center justify-center rounded-md ${cls}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{n.title}</div>
                          <div className="text-sm text-gray-600 truncate">{n.message}</div>
                          <div className="mt-1 text-xs text-gray-500 inline-flex items-center gap-1"><Clock size={12} /> {n.time}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="px-3 py-2 text-xs text-gray-600 border-t bg-white/80">Cliquez en dehors pour fermer</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative" ref={profileWrapRef}>
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded" onClick={() => { setOpen(o => !o); setNotifOpen(false) }}>
            <UserCircle2 size={22} />
            <span className="text-sm hidden sm:block">Compte</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-card p-1 z-[10001]">
              <Link
                to="/profile"
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                onClick={() => setOpen(false)}
              >
                Profil
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => { setOpen(false); navigate('/security') }}>Paramètres</button>
              <div className="h-px bg-gray-200 my-1" />
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded">Se déconnecter</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
