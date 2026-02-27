import React, { useState, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Flag,
  Pencil,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import CommentInput from './CommentInput'
import { formatDistanceToNow } from 'date-fns'
import { UserAvatar } from './UserAvatar'


const CommentItem = ({
  comment,
  onReply,
  onLike,
  onFlag,
  onEdit,
  onDelete,
  currentUser,
  depth = 0,
  maxDepth = 3
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { API_BASE_URL } = useContext(AuthContext)
  const { hasRole, hasSubrole } = useContext(AuthContext)

  const isOwner = currentUser?.id === comment.user
  const isAdmin = (hasRole && hasRole('ADMIN')) || (hasSubrole && hasSubrole('BOOKHUB_MANAGER'))
  const hasReplies = comment.replies && comment.replies.length > 0
  const canNest = depth < maxDepth



  const getInitials = (user) => {
    if (!user) return "U"
    const details = user.user_details || user
    return `${details.first_name?.[0] || ''}${details.last_name?.[0] || ''}`.toUpperCase() || "U"
  }

  const getUserDetails = () => {
    return comment.user_details || comment.user
  }

  const getProfileUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http://localhost')) {
      return url.replace(/http:\/\/localhost:\d+/, API_BASE_URL)
    }
    return url
  }

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  const renderCommentText = (text) => {
    if (!text) return null
    const parts = text.split(/(@[\w.-]+@[\w.-]+\.\w+)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('@') && part.includes('.')) {
        const mention = comment.mentions_details?.find(m => 
          `@${m.email}` === part
        )
        return (
          <span 
            key={index}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            @{mention ? `${mention.first_name} ${mention.last_name}` : part.slice(1)}
          </span>
        )
      }
      return part
    })
  }

  const handleReply = async (text) => {
    const result = await onReply(comment.id, text)
    if (result?.success) {
      setShowReplyInput(false)
      setShowReplies(true)
    }
    return result
  }

  const handleEdit = async (text) => {
    const result = await onEdit(comment.id, text)
    if (result?.success) {
      setIsEditing(false)
    }
    return result
  }

  const handleFlag = async () => {
    if (!flagReason.trim()) return
    const result = await onFlag(comment.id, flagReason)
    if (result?.success) {
      setShowFlagDialog(false)
      setFlagReason("")
    }
  }

  const handleDelete = async () => {
    const result = await onDelete(comment.id)
    if (result?.success) {
      setShowDeleteDialog(false)
    }
  }

  const userDetails = getUserDetails()
  const isLiked = !!(comment.is_liked || comment.liked)

  return (
    <div className={`group ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar - Fixed */}
        <UserAvatar 
          src={getProfileUrl(userDetails?.user_profile)}
          fallback={getInitials(comment)}
          size={32}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {userDetails?.first_name} {userDetails?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
            {comment.is_flagged && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Flagged
              </Badge>
            )}
          </div>

          {/* Comment Text or Edit Mode */}
          {isEditing ? (
            <div className="mt-2">
              <CommentInput
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                showCancel
                autoFocus
                initialValue={comment.comment}
                submitLabel="Save"
                compact
                currentUser={currentUser}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {renderCommentText(comment.comment)}
            </p>
          )}

          {/* Mentioned Users - Fixed Avatars */}
          {/* {comment.mentions_details?.length > 0 && !isEditing && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {comment.mentions_details.map((mention) => (
                <Badge 
                  key={mention.id} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0.5 gap-1 flex items-center"
                >
                  <UserAvatar 
                    src={getProfileUrl(mention.user_profile)}
                    fallback={mention.first_name?.[0]}
                    size={14}
                  />
                  {mention.first_name}
                </Badge>
              ))}
            </div>
          )} */}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(comment.id)}
                className={`h-7 px-2 text-xs gap-1 ${
                  isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                {comment.like_count > 0 && comment.like_count}
              </Button>

              {canNest && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Reply className="h-3.5 w-3.5" />
                  Reply
                </Button>
              )}

              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      Hide {comment.replies.length}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      Show {comment.replies.length}
                    </>
                  )}
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {(isOwner || isAdmin) && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {!isOwner && !isAdmin && (
                    <DropdownMenuItem onClick={() => setShowFlagDialog(true)}>
                      <Flag className="h-3.5 w-3.5 mr-2" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 pl-2 border-l-2 border-primary/30">
              <CommentInput
                onSubmit={handleReply}
                onCancel={() => setShowReplyInput(false)}
                showCancel
                autoFocus
                placeholder={`Reply to ${userDetails?.first_name}...`}
                submitLabel="Reply"
                compact
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onFlag={onFlag}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUser={currentUser}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Report Comment
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for reporting this comment.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Describe the issue..."
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleFlag}
              disabled={!flagReason.trim()}
            >
              Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentItem