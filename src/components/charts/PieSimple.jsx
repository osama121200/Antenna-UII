import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#1d4ed8', '#3b82f6']

export default function PieSimple({ data, dataKey = 'value', nameKey = 'name', valueFormatter }) {
  const total = data.reduce((acc, d) => acc + (d[dataKey] ?? 0), 0)
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            isAnimationActive
            animationDuration={500}
            animationEasing="ease-out"
            labelLine={false}
            label={({ percent }) => `${Math.round(percent * 100)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, _n, { payload }) => {
            const pct = total ? Math.round((v / total) * 100) : 0
            const formatted = valueFormatter ? valueFormatter(v) : v
            return [`${formatted} (${pct}%)`, payload?.[nameKey]]
          }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
