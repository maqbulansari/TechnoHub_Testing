// components/ui/AvatarSkeleton.jsx
import React from 'react'

const AvatarSkeleton = ({ size = 32 }) => {
  return (
    <div
      className="relative overflow-hidden bg-muted rounded-full shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 avatar-shimmer" />
    </div>
  )
}

export default AvatarSkeleton
