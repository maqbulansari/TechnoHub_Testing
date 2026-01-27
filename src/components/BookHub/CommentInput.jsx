import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, AtSign } from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import { UserAvatar } from './UserAvatar'

const CommentInput = ({
    onSubmit,
    placeholder = "Write a comment...",
    submitLabel = "Post",
    currentUser,
    onCancel,
    showCancel = false,
    autoFocus = false,
    initialValue = "",
    compact = false
}) => {
    const [text, setText] = useState(initialValue)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef(null)
    const { API_BASE_URL } = useContext(AuthContext)

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [autoFocus])

    // Auto resize textarea
    useEffect(() => {
        if (!textareaRef.current) return
        textareaRef.current.style.height = 'auto'
        const minHeight = compact ? 60 : 80
        const maxHeight = 200
        textareaRef.current.style.height = `${Math.min(
            Math.max(textareaRef.current.scrollHeight, minHeight),
            maxHeight
        )}px`
    }, [text, compact])

    const handleSubmit = async () => {
        if (!text.trim() || isSubmitting) return
        setIsSubmitting(true)
        try {
            const result = await onSubmit(text.trim())
            if (result?.success) {
                setText("")
                onCancel?.()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === 'Escape' && onCancel) onCancel()
    }

    const getProfileUrl = (url) => {
        if (!url) return null
        if (url.startsWith('http://localhost')) {
            return url.replace(/http:\/\/localhost:\d+/, API_BASE_URL)
        }
        return url
    }

    const getInitials = (user) =>
        `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || 'U'

    console.log(currentUser);

    return (
        <div className="flex gap-3 items-start">
            {/* Avatar */}

           {!compact && (
                <div className="relative shrink-0 pt-1">
                    <UserAvatar
                        src={getProfileUrl(currentUser?.user_profile)}
                        fallback={getInitials(currentUser)}
                        size={36}
                    />

                    {currentUser?.is_admin && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-primary px-1 text-[9px] leading-tight text-primary-foreground">
                            Admin
                        </span>
                    )}
                </div>
            )}

            {/* Input */}
            <div className="flex-1 min-w-0">
                <div
                    className={`relative rounded-lg border bg-background transition-all
            ${isFocused
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-input hover:border-muted-foreground/50'
                        }`}
                >
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        rows={compact ? 2 : 3}
                        className={`w-full bg-transparent text-sm resize-none focus:outline-none
              ${compact ? 'px-3 py-2 min-h-[60px]' : 'px-3 py-3 min-h-[80px]'}
            `}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {/* <AtSign className="h-3 w-3" /> */}
                        <span className="hidden text-nowrap sm:inline">Use @ to mention</span>
                        <span className="hidden text-nowrap md:inline  opacity-60">
                            · Press <kbd className="mx-1 px-1 text-gray-800 bg-muted rounded">⌘</kbd>
                            <kbd className="px-1 bg-muted text-gray-800 rounded">↵</kbd>
                        </span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {showCancel && (
                            <Button variant="ghost" size="sm" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={!text.trim() || isSubmitting}
                            className="gap-1.5"
                        >
                            {isSubmitting ? (
                                <>
    
                                    Posting…
                                </>
                            ) : (
                                <>
                                    <Send className="h-3 w-3" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentInput
