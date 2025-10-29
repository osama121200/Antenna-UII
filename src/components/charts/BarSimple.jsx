import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function BarSimple({ data, dataKey = 'value', name = 'Valeur', color = '#2563eb', valueFormatter, xAngle = -35 }) {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: xAngle !== 0 ? 36 : 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            minTickGap={8}
            tickMargin={8}
            angle={xAngle}
            textAnchor={xAngle !== 0 ? 'end' : 'middle'}
            interval={xAngle !== 0 ? 0 : 'preserveEnd'}
          />
          <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
          <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(v) => valueFormatter ? valueFormatter(v) : v} />
          <Legend />
          <Bar dataKey={dataKey} name={name} fill={color} radius={[4,4,0,0]} isAnimationActive animationDuration={500} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
