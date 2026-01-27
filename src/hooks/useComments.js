import { useState, useCallback, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '@/contexts/authContext'

export const useComments = (bookId) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  
  const { API_BASE_URL } = useContext(AuthContext)
  
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  })

  // Fetch comments for a book
  const fetchComments = useCallback(async (options = {}) => {
    const { topLevelOnly = true, ordering = '-created_at', search = '' } = options
    
    try {
      setLoading(true)
      setError(null)
      
      let url = `${API_BASE_URL}/bookhub/comments/?book=${bookId}`
      if (topLevelOnly) url += '&top_level=true'
      if (ordering) url += `&ordering=${ordering}`
      if (search) url += `&search=${search}`
      
      const response = await axios.get(url, getAuthHeader())
      
      // Handle paginated or direct response
      const commentsData = response.data.results || response.data
      setComments(commentsData)
      setHasMore(!!response.data.next)
      
      return commentsData
    } catch (err) {
      setError('Failed to load comments')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }, [API_BASE_URL, bookId])

  // Add new comment
  const addComment = useCallback(async (commentText) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookhub/comments/`,
        { book: bookId, comment: commentText },
        getAuthHeader()
      )
      
      setComments(prev => [response.data, ...prev])
      return { success: true, data: response.data }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.response?.data?.error || 'Failed to add comment' }
    }
  }, [API_BASE_URL, bookId])

  // Reply to a comment
  const replyToComment = useCallback(async (parentId, commentText) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookhub/comments/${parentId}/reply/`,
        { comment: commentText },
        getAuthHeader()
      )
      
      // Update the parent comment's replies
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data]
          }
        }
        return comment
      }))
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.response?.data?.error || 'Failed to reply' }
    }
  }, [API_BASE_URL])

  // Like/Unlike a comment
  const toggleLike = useCallback(async (commentId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookhub/comments/${commentId}/like/`,
        {},
        getAuthHeader()
      )
      
      // Update comment in state
      const updateCommentLike = (comments) => comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: response.data.liked,
            like_count: response.data.like_count
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentLike(comment.replies)
          }
        }
        return comment
      })
      
      setComments(prev => updateCommentLike(prev))
      return { success: true, data: response.data }
    } catch (err) {
      console.error(err)
      return { success: false, error: 'Failed to like comment' }
    }
  }, [API_BASE_URL])

  // Flag a comment
  const flagComment = useCallback(async (commentId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookhub/comments/${commentId}/flag/`,
        { reason },
        getAuthHeader()
      )
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error(err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to flag comment' 
      }
    }
  }, [API_BASE_URL])

  // Edit a comment
  const editComment = useCallback(async (commentId, newText) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/bookhub/comments/${commentId}/`,
        { comment: newText },
        getAuthHeader()
      )
      
      const updateCommentText = (comments) => comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, comment: newText, updated_at: new Date().toISOString() }
        }
        if (comment.replies) {
          return { ...comment, replies: updateCommentText(comment.replies) }
        }
        return comment
      })
      
      setComments(prev => updateCommentText(prev))
      return { success: true, data: response.data }
    } catch (err) {
      console.error(err)
      return { success: false, error: 'Failed to edit comment' }
    }
  }, [API_BASE_URL])

  // Delete a comment (if user owns it)
  const deleteComment = useCallback(async (commentId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/bookhub/comments/${commentId}/`,
        getAuthHeader()
      )
      
      const removeComment = (comments) => comments.filter(comment => {
        if (comment.id === commentId) return false
        if (comment.replies) {
          comment.replies = removeComment(comment.replies)
        }
        return true
      })
      
      setComments(prev => removeComment(prev))
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: 'Failed to delete comment' }
    }
  }, [API_BASE_URL])

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
    deleteComment,
    setComments
  }
}