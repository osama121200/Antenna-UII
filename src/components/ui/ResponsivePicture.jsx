import { useEffect, useRef, useState } from 'react'

// Expects a "picture" object from vite-imagetools (as=picture):
// {
//   sources: [{ type: 'image/webp', srcset: '...' }, { type: 'image/jpeg', srcset: '...' }],
//   img: { src: '...', w: number, h: number }
// }
export default function ResponsivePicture({
  picture,
  alt = '',
  className = '',
  imgClassName = '',
  ratioClass = 'aspect-video',
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  priority = false,
  placeholderSrc,
}) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(priority)
  const ref = useRef(null)

  useEffect(() => {
    if (priority || !ref.current) return
    const el = ref.current
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [priority])

  return (
    <div ref={ref} className={`relative overflow-hidden ${ratioClass} ${className}`}>
      {!loaded && (
        placeholderSrc ? (
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-md scale-105 opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )
      )}
      {inView && (
        <picture>
          {Array.isArray(picture?.sources) && picture.sources.map((s, i) => (
            <source key={i} type={s.type} srcSet={s.srcset} sizes={sizes} />
          ))}
          <img
            src={picture?.img?.src || ''}
            width={picture?.img?.w}
            height={picture?.img?.h}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition duration-300 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'} ${imgClassName}`}
          />
        </picture>
      )}
    </div>
  )
}


