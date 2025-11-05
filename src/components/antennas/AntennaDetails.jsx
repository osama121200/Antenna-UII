import { useMemo, useState } from 'react'

export default function AntennaDetails({ title = 'Plan d\'antenne', images: inputImages }) {
  // Load demo images if none provided
  const fallbackImages = useMemo(() => {
    if (inputImages && inputImages.length > 0) return inputImages
    const modules = import.meta.glob('../../assets/images/gestionAntennes/*.{jpg,JPG,jpeg,png,webp}', { eager: true, as: 'url' })
    const urls = Object.values(modules)
    const sampleHeights = [58, 52, 47, 41, 36, 30, 24, 18]
    return urls.slice(0, 8).map((url, i) => ({ url, name: `Ville0${(i % 8) + 1}`, hauteur: sampleHeights[i % sampleHeights.length] }))
  }, [inputImages])

  const images = fallbackImages

  const [preview, setPreview] = useState(null)

  // Compute vertical positions based on hauteur (meters). Top = highest.
  const layout = useMemo(() => {
    const heights = images.map(it => typeof it.hauteur === 'number' ? it.hauteur : null)
    const hasAnyHeight = heights.some(h => h !== null)
    let minH = Infinity, maxH = -Infinity
    if (hasAnyHeight) {
      heights.forEach(h => { if (h !== null) { if (h < minH) minH = h; if (h > maxH) maxH = h } })
      if (!isFinite(minH) || !isFinite(maxH) || minH === maxH) {
        // Degenerate case: treat as evenly spaced
        return images.map((it, i, arr) => {
          const t = arr.length > 1 ? 1 - (i / (arr.length - 1)) : 0.5
          return { ...it, hauteur: it.hauteur ?? null, topPct: t * 100 }
        })
      }
      return images.map((it, i) => {
        const h = typeof it.hauteur === 'number' ? it.hauteur : (minH + ((maxH - minH) * (i / Math.max(1, images.length - 1))))
        const norm = (h - minH) / (maxH - minH)
        const t = 1 - norm
        return { ...it, hauteur: h, topPct: t * 100 }
      })
    }
    // Fallback: evenly space if no metadata
    return images.map((it, i, arr) => {
      const t = arr.length > 1 ? 1 - (i / (arr.length - 1)) : 0.5
      return { ...it, hauteur: null, topPct: t * 100 }
    })
  }, [images])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="relative h-[420px] md:h-[520px] rounded-lg border bg-white shadow-sm overflow-hidden">
          {/* Vertical antenna line */}
          <div className="absolute left-6 md:left-10 top-3 bottom-3 w-1 bg-gray-300 rounded" />
          {/* Thumbnails positioned by hauteur */}
          <div className="absolute inset-0">
            {layout.map((it, idx) => (
              <div
                key={idx}
                className="absolute flex items-center gap-3"
                style={{ top: `calc(${it.topPct}% - 16px)`, left: '3rem' }}
              >
                <button
                  className="h-8 w-8 rounded-md overflow-hidden border shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  onClick={() => setPreview(it)}
                  onMouseEnter={() => setPreview(it)}
                  onMouseLeave={() => setPreview(null)}
                >
                  <img src={it.url} alt={it.name || 'Antenne'} className="h-full w-full object-cover" />
                </button>
                <div className="text-xs text-gray-700 whitespace-nowrap">
                  {typeof it.hauteur === 'number' ? `Hauteur: ${Math.round(it.hauteur)} m` : 'Hauteur: —'}
                </div>
              </div>
            ))}
          </div>
          {/* Hover/click preview */}
          {preview && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-md border shadow-2xl p-2 w-[220px] z-[10]">
              <div className="text-xs text-gray-600 mb-1 truncate" title={preview.name || ''}>{preview.name || 'Image'}</div>
              <img src={preview.url} alt={preview.name || 'Preview'} className="w-full h-40 object-cover rounded" />
              <div className="mt-1 text-xs text-gray-600">
                {typeof preview.hauteur === 'number' ? `Hauteur: ${Math.round(preview.hauteur)} m` : 'Hauteur: —'}
              </div>
            </div>
          )}
          {/* Scale labels */}
          <div className="absolute left-2 md:left-3 top-2 text-[10px] text-gray-500">Sommet</div>
          <div className="absolute left-2 md:left-3 bottom-2 text-[10px] text-gray-500">Base</div>
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Galerie</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((it, i) => (
            <div key={i} className="rounded-lg border bg-white shadow-sm overflow-hidden group cursor-pointer" onClick={() => setPreview(it)}>
              <div className="aspect-video overflow-hidden">
                <img src={it.url} alt={it.name || 'Antenne'} className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-200" />
              </div>
              <div className="px-2 py-1 text-xs text-gray-700 flex items-center justify-between">
                <span className="truncate" title={it.name || ''}>{it.name || 'Image'}</span>
                <span className="text-gray-500 ml-2 whitespace-nowrap">{typeof it.hauteur === 'number' ? `${Math.round(it.hauteur)} m` : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


