import { useState } from 'react'

export default function LazyImage({ src, alt = '', className = '', imgClassName = '', ratioClass = 'aspect-video' }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${ratioClass} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition duration-300 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'} ${imgClassName}`}
      />
    </div>
  )
}


