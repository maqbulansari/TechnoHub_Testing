// components/comments/CommentSkeleton.jsx
import React from 'react'
import AvatarSkeleton from './AvatarSkeleton'

const Skeleton = ({ className }) => (
  <div
    className={`relative overflow-hidden bg-muted ${className}`}
  >
    <span className="absolute inset-0 shimmer-mask" />
  </div>
)

const CommentSkeleton = ({ depth = 0 }) => {
  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4' : ''}`}>
      <div className="flex gap-3 items-start">
        {/* Avatar — TRUE circle */}
        <AvatarSkeleton size={32} />

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Username */}
          <Skeleton className="h-3 w-28 rounded-full" />

          {/* Comment lines */}
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-5/6 rounded-full" />

          {/* Meta */}
          <Skeleton className="h-2.5 w-24 rounded-full mt-1" />
        </div>
      </div>
    </div>
  )
}

export default CommentSkeleton
