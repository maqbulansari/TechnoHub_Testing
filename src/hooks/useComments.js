import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { AuthContext } from '@/contexts/authContext'
import { TECHNO_BASE_URL } from '@/environment'

export const useComments = (bookId) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const socketRef = useRef(null)
  const { API_BASE_URL } = useContext(AuthContext)

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  })
  const getWebSocketUrl = (baseUrl, bookId) => {
    const wsProtocol = TECHNO_BASE_URL.startsWith('https') ? 'wss' : 'ws'

    const host = TECHNO_BASE_URL
      .replace(/^https?:\/\//, '')
      .replace(/\/techno\/?$/, '')

    return `${wsProtocol}://${host}/ws/bookhub/comments/${bookId}/`
  }


  /* Helpers (IMMUTABLE + SAFE)*/

  const upsertRecursive = (items, updater) =>
    items.map(item => {
      const updated = updater(item)
      if (updated) return updated
      if (item.replies) {
        return { ...item, replies: upsertRecursive(item.replies, updater) }
      }
      return item
    })

  const removeRecursive = (items, id) =>
    items
      .filter(item => item.id !== id)
      .map(item =>
        item.replies
          ? { ...item, replies: removeRecursive(item.replies, id) }
          : item
      )

  /* WebSocket message handler (SOURCE OF TRUTH)*/

  const handleSocketMessage = useCallback((data) => {
    const { event_type, payload } = data

    setComments(prev => {
      switch (event_type) {

        case 'new_comment':
          if (prev.some(c => c.id === payload.id)) return prev
          return [payload, ...prev]

        case 'new_reply':
          return upsertRecursive(prev, c => {
            if (c.id === payload.parent_id) {
              const exists = (c.replies || []).some(r => r.id === payload.reply.id)
              if (exists) return c
              return {
                ...c,
                replies: [...(c.replies || []), payload.reply],
                reply_count: (c.reply_count || 0) + 1
              }
            }
            return null
          })

        case 'comment_updated':
          return upsertRecursive(prev, c =>
            c.id === payload.id ? { ...c, ...payload } : null
          )

        case 'comment_deleted':
          return removeRecursive(prev, payload.id)

        case 'comment_liked':
          return upsertRecursive(prev, c =>
            c.id === payload.comment_id
              ? { ...c, like_count: payload.like_count, liked: payload.liked }
              : null
          )

        case 'comment_flagged':
          return upsertRecursive(prev, c =>
            c.id === payload.comment_id
              ? { ...c, is_flagged: payload.is_flagged }
              : null
          )

        default:
          return prev
      }
    })
  }, [])

  /*  WebSocket lifecycle*/

  useEffect(() => {
    if (!bookId) return

    if (socketRef.current) {
      socketRef.current.close()
    }

    // const socket = new WebSocket(
    //   `wss://xbzp7968-7000.inc1.devtunnels.ms/ws/bookhub/comments/${bookId}/`
    // )
    const socket = new WebSocket(
      getWebSocketUrl(TECHNO_BASE_URL, bookId)
    )


    socketRef.current = socket

    socket.onopen = () => console.log('🟢 WebSocket connected')
    socket.onmessage = e => handleSocketMessage(JSON.parse(e.data))
    socket.onerror = e => console.error('WebSocket error:', e)
    socket.onclose = () => console.log('🔴 WebSocket disconnected')

    return () => socket.close()
  }, [bookId, handleSocketMessage])

  /* REST: fetch only (MERGE, never overwrite)*/

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${TECHNO_BASE_URL}/bookhub/comments/?book=${bookId}&top_level=true`
      )

      const data = res.data.results || res.data

      // Sort descending by ID (latest first)
      data.sort((a, b) => b.id - a.id)

      setComments(data)

      setHasMore(!!res.data.next)
      return data
    } catch (err) {
      setError('Failed to load comments')
      return []
    } finally {
      setLoading(false)
    }
  }, [TECHNO_BASE_URL, bookId])


  /* REST mutations (DO NOT touch state here)
     Socket will update UI */

  const addComment = async (text, mentionedUsers = []) => {
    await axios.post(
      `${TECHNO_BASE_URL}/bookhub/comments/`,
      {
        book: bookId,
        comment: text,
        mentioned_users: mentionedUsers
      },
      getAuthHeader()
    )
  }

  const replyToComment = async (parentId, text) => {
    await axios.post(
      `${TECHNO_BASE_URL}/bookhub/comments/${parentId}/reply/`,
      { comment: text },
      getAuthHeader()
    )
  }

  const toggleLike = async (id) => {
    await axios.post(
      `${TECHNO_BASE_URL}/bookhub/comments/${id}/like/`,
      {},
      getAuthHeader()
    )
  }

  const flagComment = async (id, reason) => {
    await axios.post(
      `${TECHNO_BASE_URL}/bookhub/comments/${id}/flag/`,
      { reason },
      getAuthHeader()
    )
  }

  const editComment = async (id, text) => {
    await axios.patch(
      `${TECHNO_BASE_URL}/bookhub/comments/${id}/`,
      { comment: text },
      getAuthHeader()
    )
  }

  const deleteComment = async (id) => {
    await axios.delete(
      `${TECHNO_BASE_URL}/bookhub/comments/${id}/`,
      getAuthHeader()
    )
  }

  return {
    comments,
    loading,
    error,
    hasMore,
    fetchComments,
    addComment,
    replyToComment,
    toggleLike,
    flagComment,
    editComment,
    deleteComment
  }
}
