import { useEffect, useState } from 'react'
import LazyImage from './LazyImage'
import { X } from 'lucide-react'

export default function ImageOverlay({ open, title, images = [], onClose, getMeta, ratioClass = 'aspect-square' }) {
	const [animate, setAnimate] = useState(false)

	useEffect(() => {
		if (!open) return
		const id = requestAnimationFrame(() => setAnimate(true))
		const prevOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
		window.addEventListener('keydown', onKey)
		return () => {
			cancelAnimationFrame(id)
			setAnimate(false)
			document.body.style.overflow = prevOverflow
			window.removeEventListener('keydown', onKey)
		}
	}, [open, onClose])

	if (!open) return null

	return (
		<div className={`fixed inset-0 z-[9999] ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
			<div
				className={`absolute inset-0 bg-black/80 transition-opacity duration-200`}
				onClick={onClose}
			/>
			<div className="absolute inset-0 flex items-start justify-center p-4 md:p-8 z-10">
				<div className={`w-full max-w-7xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] ${animate ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} transition-all duration-200`}>
					<div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-gray-50">
						<div className="flex items-center gap-3">
							<div className="text-base sm:text-lg font-semibold text-gray-800">{title}</div>
							<div className="text-xs sm:text-sm text-gray-500">
								{images.length} images
							</div>
						</div>
						<button
							className="btn btn-outline h-9 px-3 flex items-center gap-2"
							onClick={onClose}
							aria-label="Fermer la galerie"
						>
							<X size={16} /> Fermer
						</button>
					</div>

					<div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
							{images.map((img, idx) => {
								const meta = getMeta ? getMeta(img, idx) : null
								return (
									<div key={idx} className="group rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
										<LazyImage
											src={img.url}
											alt={img.alt || img.name || `Image ${idx + 1}`}
											ratioClass={ratioClass}
											imgClassName="transform group-hover:scale-[1.02] transition-transform duration-200"
										/>
										<div className="px-3 py-2">
											{img.name && <div className="text-xs font-medium text-gray-800 truncate" title={img.name}>{img.name}</div>}
											{Array.isArray(meta) ? meta.map((line, i) => (
												<div key={i} className="text-[11px] text-gray-500">{line}</div>
											)) : null}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

