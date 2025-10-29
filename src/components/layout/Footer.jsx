export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container-page pt-4 pb-6 border-t text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} Antennes Drone — Démo</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-gray-900 cursor-pointer">Confidentialité</span>
          <span className="hover:text-gray-900 cursor-pointer">Conditions</span>
          <span className="hover:text-gray-900 cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  )
}


