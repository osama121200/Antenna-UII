export default function Spinner({ label = 'Chargement…', className = '' }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <div className="inline-flex items-center gap-3 text-sm text-gray-600">
        <span className="h-4 w-4 inline-block rounded-full border-2 border-gray-300 border-t-primary animate-spin"></span>
        <span>{label}</span>
      </div>
    </div>
  )
}


