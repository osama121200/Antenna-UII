import { motion } from 'framer-motion'

export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="card p-4 flex items-center gap-4">
      {Icon && (
        <div className="p-2 rounded-md bg-gray-100 text-gray-700"><Icon size={18} /></div>
      )}
      <div className="flex-1">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
        {hint && <div className="text-sm text-gray-600 mt-1">{hint}</div>}
      </div>
    </motion.div>
  )}
