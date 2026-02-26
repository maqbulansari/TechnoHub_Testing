import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, AtSign, X } from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import { TECHNO_BASE_URL } from '@/environment'
import axios from 'axios'
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
    const [showMentions, setShowMentions] = useState(false)
    const [mentionSuggestions, setMentionSuggestions] = useState([])
    const [mentionLoading, setMentionLoading] = useState(false)
    const [mentionQuery, setMentionQuery] = useState("")
    const [mentionedUsers, setMentionedUsers] = useState([])
    const textareaRef = useRef(null)
    const mentionDropdownRef = useRef(null)
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

    // Resolve mentions to emails before submitting.
    const resolveMentionEmails = async (commentText) => {
        // find all @tokens (alphanumeric, dot, dash, underscore)
        const mentionRegex = /@([\w.\-]+)/g
        const found = [...new Set(Array.from(commentText.matchAll(mentionRegex)).map(m => m[1]))]

        const finalMentioned = [...mentionedUsers] // start with already selected
        let newText = commentText

        for (const username of found) {
            // skip if we already have this username
            const existing = finalMentioned.find(u => u.username === username || u.email === username)
            if (existing) {
                // replace @username with @email if email exists
                if (existing.email) newText = newText.replace(new RegExp(`@${username}\b`, 'g'), `@${existing.email}`)
                continue
            }

            // query API for this username to try to resolve to an email
            try {
                const resp = await axios.post(
                    `${API_BASE_URL}bookhub/comments/get-mention-suggestions/`,
                    { comment: `@${username}` },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
                )
                const suggestions = resp.data?.suggestions || []
                if (suggestions.length > 0) {
                    // Prefer exact username match by username or first_name
                    const match = suggestions.find(s => (s.username && s.username === username) || (s.first_name && s.first_name.toLowerCase() === username.toLowerCase())) || suggestions[0]
                    if (match) {
                        finalMentioned.push({ id: match.id, username: match.username || match.first_name, email: match.email })
                        if (match.email) newText = newText.replace(new RegExp(`@${username}\b`, 'g'), `@${match.email}`)
                    }
                }
            } catch (err) {
                console.error('Error resolving mention', username, err)
            }
        }

        return { text: newText, mentioned: finalMentioned }
    }

    const handleSubmit = async () => {
        if (!text.trim() || isSubmitting) return
        setIsSubmitting(true)
        try {
            const resolved = await resolveMentionEmails(text.trim())
            const result = await onSubmit(resolved.text, resolved.mentioned)
            
            // Handle success (whether explicitly returned or undefined)
            if (result?.success !== false) {
                setText("")
                setShowMentions(false)
                setMentionSuggestions([])
                setMentionedUsers([])
                onCancel?.()
            }
            
        } finally {
            setIsSubmitting(false)
        }
    }

    const fetchMentionSuggestions = async (query) => {
        setMentionLoading(true)
        try {
            const response = await axios.get(
                `${TECHNO_BASE_URL}/bookhub/comments/mention-suggestions/?q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            )
            setMentionSuggestions(response.data?.suggestions || [])
        } catch (error) {
            console.error('Error fetching mention suggestions:', error)
            setMentionSuggestions([])
        } finally {
            setMentionLoading(false)
        }
    }

    const handleTextChange = (e) => {
        const newText = e.target.value
        setText(newText)

        // Detect @ mention
        const lastAtIndex = newText.lastIndexOf('@')
        if (lastAtIndex !== -1) {
            const afterAt = newText.substring(lastAtIndex + 1)
            // Check if we're in a word after @
            if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
                setMentionQuery(afterAt)
                setShowMentions(true)
                fetchMentionSuggestions(afterAt)
            } else {
                setShowMentions(false)
                setMentionQuery("")
            }
        } else {
            setShowMentions(false)
            setMentionQuery("")
            setMentionSuggestions([])
        }
    }

    const insertMention = (user) => {
        // Find the last @ position
        const lastAtIndex = text.lastIndexOf('@')
        if (lastAtIndex === -1) return

        const username = typeof user === 'string' ? user : (user.username || user.first_name)
        const userEmail = typeof user === 'string' ? null : user.email
        const userId = typeof user === 'string' ? null : user.id

        // Replace from @ to end of current word
        const beforeAt = text.substring(0, lastAtIndex)
        const afterAt = text.substring(lastAtIndex + 1)
        
        // Find where the mention query ends
        const queryEndIndex = afterAt.search(/[\s\n]/) === -1 ? afterAt.length : afterAt.search(/[\s\n]/)
        const afterMention = afterAt.substring(queryEndIndex)
        
        // Use email for insertion if available, otherwise username
        const insertValue = userEmail || username
        const newText = `${beforeAt}@${insertValue} ${afterMention}`
        setText(newText)
        
        // Track mentioned user with email
        if (userEmail && userId) {
            setMentionedUsers(prev => {
                // Avoid duplicates
                if (prev.some(u => u.id === userId)) {
                    return prev
                }
                return [...prev, { id: userId, username, email: userEmail }]
            })
        }
        
        setShowMentions(false)
        setMentionSuggestions([])
        
        // Focus textarea and move cursor to end
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                textareaRef.current.setSelectionRange(newText.length, newText.length)
            }
        }, 0)
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

                                    {(() => {
                                        try {
                                            const { hasRole, hasSubrole } = useContext(AuthContext)
                                            const isAdmin = currentUser?.is_admin || (hasRole && hasRole('ADMIN')) || (hasSubrole && hasSubrole('BOOKHUB_MANAGER'))
                                            return isAdmin ? (
                                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-primary px-1 text-[9px] leading-tight text-primary-foreground">
                                                    Admin
                                                </span>
                                            ) : null
                                        } catch (e) {
                                            // fallback: use API-provided flag
                                            return currentUser?.is_admin ? (
                                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-primary px-1 text-[9px] leading-tight text-primary-foreground">
                                                    Admin
                                                </span>
                                            ) : null
                                        }
                                    })()}
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
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false)
                            // Close mentions dropdown after a short delay to allow clicks
                            setTimeout(() => setShowMentions(false), 200)
                        }}
                        placeholder={placeholder}
                        rows={compact ? 2 : 3}
                        className={`w-full bg-transparent text-sm resize-none focus:outline-none
              ${compact ? 'px-3 py-2 min-h-[60px]' : 'px-3 py-3 min-h-[80px]'}
            `}
                    />

                    {/* Mention Suggestions Dropdown */}
                    {showMentions && (
                        <div
                            ref={mentionDropdownRef}
                            className="absolute top-full left-0 mt-1 max-h-60 bg-background border border-input rounded-lg shadow-lg z-50 overflow-y-auto min-w-72"
                        >
                            {mentionLoading ? (
                                <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : mentionSuggestions.length > 0 ? (
                                mentionSuggestions.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            insertMention(user)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 border-b last:border-b-0"
                                    >
                                        <UserAvatar
                                            src={user.profile_pic}
                                            fallback={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()}
                                            size={32}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-xs">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {user.email || `@${user.username || user.first_name}`}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="py-3 text-center text-sm text-muted-foreground">
                                    No users found
                                </div>
                            )}
                        </div>
                    )}
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
