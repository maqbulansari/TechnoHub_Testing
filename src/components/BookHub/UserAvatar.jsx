// components/ui/user-avatar.jsx
import { useState } from 'react'

// Professional soft colors
const avatarColors = [
  { bg: '#FEE2E2', text: '#DC2626' },
  { bg: '#FFEDD5', text: '#EA580C' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#ECFCCB', text: '#65A30D' },
  { bg: '#D1FAE5', text: '#059669' },
  { bg: '#CCFBF1', text: '#0D9488' },
  { bg: '#CFFAFE', text: '#0891B2' },
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#E0E7FF', text: '#4F46E5' },
  { bg: '#EDE9FE', text: '#7C3AED' },
  { bg: '#F3E8FF', text: '#9333EA' },
  { bg: '#FCE7F3', text: '#DB2777' },
]

const getColorIndex = (str) => {
  if (!str) return 0
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % avatarColors.length
}

export const UserAvatar = ({ src, fallback, size = 32, className = "" }) => {
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!src)

  const colorIndex = getColorIndex(fallback)
  const colors = avatarColors[colorIndex]

  const showFallback = !src || imgError

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {/* Skeleton */}
      {isLoading && src && (
        <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
      )}

      {src && !imgError ? (
        <img
          src={src}
          alt=""
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgError(true)
            setIsLoading(false)
          }}
          className={`w-full h-full object-cover rounded-full transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full rounded-full"
          style={{ backgroundColor: colors.bg }}
        >
          <span
            className="font-semibold"
            style={{ fontSize: size * 0.4, color: colors.text }}
          >
            {fallback}
          </span>
        </div>
      )}
    </div>
  )
}
