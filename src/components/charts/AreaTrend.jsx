import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

export default function AreaTrend({ data, dataKey = 'value', color = '#2563eb', valueFormatter }) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`areaColor-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} minTickGap={8} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
          <Tooltip
            cursor={{ stroke: '#e5e7eb' }}
            formatter={(v) => valueFormatter ? valueFormatter(v) : v}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fillOpacity={1}
            fill={`url(#areaColor-${dataKey})`}
            isAnimationActive
            animationDuration={500}
            animationEasing="ease-out"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
