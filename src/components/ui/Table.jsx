export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'Aucune donnée', sortKey, sortDir = 'asc', onSort }) {
  const colCount = columns.length || 1

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => {
              const isSorted = sortKey && sortKey === col.key
              const arrow = isSorted ? (sortDir === 'asc' ? '▲' : '▼') : ''
              const sortable = col.sortable && onSort
              return (
                <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none">
                  {sortable ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                      onClick={() => onSort(col.key, isSorted && sortDir === 'asc' ? 'desc' : 'asc')}
                    >
                      <span>{col.title}</span>
                      {arrow && <span aria-hidden>{arrow}</span>}
                    </button>
                  ) : (
                    <span>{col.title}</span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`}>
                <td colSpan={colCount} className="px-4 py-3">
                  <div className="h-4 w-full skeleton" />
                </td>
              </tr>
            ))
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={colCount} className="px-4 py-6 text-sm text-gray-600 text-center">{emptyMessage}</td>
            </tr>
          )}

          {!loading && data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2 text-sm text-gray-700 align-top">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
