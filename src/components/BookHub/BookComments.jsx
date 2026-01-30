// import React, { useEffect, useState, useContext } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import {
//   MessageCircle,
//   Loader2,
//   Search,
//   SlidersHorizontal,
//   RefreshCw,
//   MessageSquare,
//   X
// } from 'lucide-react'
// import { useComments } from '@/hooks/useComments'
// import { AuthContext } from '@/contexts/authContext'
// import CommentInput from './CommentInput'
// import CommentItem from './CommentItem'
// import CommentSkeleton from './CommentSkeleton'

// const BookComments = ({ bookId, bookTitle }) => {
//   const [sortBy, setSortBy] = useState('-created_at')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isSearching, setIsSearching] = useState(false)
//   const [showSearch, setShowSearch] = useState(false)

//   const { user } = useContext(AuthContext)

//   const {
//     comments,
//     loading,
//     error,
//     fetchComments,
//     addComment,
//     replyToComment,
//     toggleLike,
//     flagComment,
//     editComment,
//     deleteComment
//   } = useComments(bookId)

//   // Initial fetch
//   useEffect(() => {
//     if (bookId) {
//       fetchComments({ ordering: sortBy })
//     }
//   }, [bookId, fetchComments, sortBy])

//   // Handle sort change
//   const handleSortChange = (value) => {
//     setSortBy(value)
//     fetchComments({ ordering: value, search: searchQuery })
//   }

//   // Handle search
//   const handleSearch = () => {
//     if (!searchQuery.trim()) return
//     setIsSearching(true)
//     fetchComments({ ordering: sortBy, search: searchQuery }).finally(() => {
//       setIsSearching(false)
//     })
//   }

//   // Clear search
//   const handleClearSearch = () => {
//     setSearchQuery('')
//     setShowSearch(false)
//     fetchComments({ ordering: sortBy })
//   }

//   // Handle refresh
//   const handleRefresh = () => {
//     setSearchQuery('')
//     fetchComments({ ordering: sortBy })
//   }

//   return (
//     <Card className="border-border shadow-sm">
//       <CardHeader className="pb-4">
//         {/* Header Row */}
//         <div className="flex flex-col gap-4">
//           {/* Title and Actions */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <MessageCircle className="h-5 w-5 text-primary" />
//               <CardTitle className="text-lg ">Discussion</CardTitle>
//               <Badge variant="outline" className="ml-1 text-nowrap text-xs">
//                 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
//               </Badge>
//             </div>

//             {/* Desktop Actions */}
//             <div className="hidden sm:flex items-center gap-2">
//               {/* Search Toggle / Input */}
//               {/* {showSearch ? (
//                 <div className="relative flex items-center">
//                   <Input
//                     type="text"
//                     placeholder="Search comments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                     className="h-8 w-48 pr-8 text-xs"
//                     autoFocus
//                   />
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleClearSearch}
//                     className="absolute right-0 h-8 w-8 p-0"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowSearch(true)}
//                   className="h-8 w-8 p-0"
//                 >
//                   <Search className="h-3.5 w-3.5" />
//                 </Button>
//               )} */}

//               {/* Sort */}
//               <Select value={sortBy} onValueChange={handleSortChange}>
//                 <SelectTrigger className="h-8 w-[130px] text-xs">
//                   <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 shrink-0" />
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="-created_at">Newest first</SelectItem>
//                   <SelectItem value="created_at">Oldest first</SelectItem>
//                   <SelectItem value="-like_count">Most liked</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Refresh */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="h-8 w-8 p-0"
//               >
//                 <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
//               </Button>
//             </div>
            
//           </div>

//           {/* Mobile Actions */}
//           <div className="flex sm:hidden items-center gap-2">
//             {/* Mobile Search */}
//             <div className="relative flex-1">
//               <Input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="h-9 pl-9 pr-9 text-sm w-full"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               {searchQuery && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleClearSearch}
//                   className="absolute right-0 top-0 h-9 w-9 p-0"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Mobile Sort */}
//             <Select value={sortBy} onValueChange={handleSortChange}>
//               <SelectTrigger className="h-9 w-[100px] text-xs shrink-0">
//                 <SelectValue placeholder="Sort" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="-created_at">Newest</SelectItem>
//                 <SelectItem value="created_at">Oldest</SelectItem>
//                 <SelectItem value="-like_count">Liked</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Mobile Refresh */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               disabled={loading}
//               className="h-9 w-9 p-0 shrink-0"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//             </Button>
//           </div>
//         </div>
//       </CardHeader>

//       <Separator />

//       <CardContent className="pt-6">
//         {/* Add Comment Section */}
//         <div className="mb-6">
//           <CommentInput
//             onSubmit={addComment}
//             placeholder={bookTitle ? `Share your thoughts on "${bookTitle}"...` : "Write a comment..."}
//             currentUser={user}
//           />
//         </div>

//         <Separator className="my-6" />

//         {/* Comments List */}
//         <div className="space-y-6">
//           {/* Loading State */}
//           {loading && comments.length === 0 && (
//            <div className="space-y-4">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <CommentSkeleton key={i} />
//         ))}
//       </div>
//           )}

//           {/* Error State */}
//           {error && !loading && (
//             <div className="flex flex-col items-center justify-center py-12 gap-4">
//               <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
//                 <MessageSquare className="h-6 w-6 text-red-500" />
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-red-500 font-medium">Failed to load comments</p>
//                 <p className="text-xs text-muted-foreground mt-1">{error}</p>
//               </div>
//               <Button variant="outline" size="sm" onClick={handleRefresh}>
//                 Try Again
//               </Button>
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && !error && comments.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-12 gap-4">
//               <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
//                 <MessageSquare className="h-8 w-8 text-muted-foreground" />
//               </div>
//               <div className="text-center">
//                 <h4 className="font-medium text-gray-900 dark:text-gray-100">
//                   {searchQuery ? 'No comments found' : 'No comments yet'}
//                 </h4>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {searchQuery
//                     ? 'Try a different search term'
//                     : 'Be the first to share your thoughts!'
//                   }
//                 </p>
//               </div>
//               {searchQuery && (
//                 <Button variant="outline" size="sm" onClick={handleClearSearch}>
//                   Clear Search
//                 </Button>
//               )}
//             </div>
//           )}

//           {/* Comments */}
//           {!loading && !error && comments.length > 0 && (
//             <>
//               {/* Search Results Info */}
//               {searchQuery && (
//                 <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg mb-4">
//                   <p className="text-sm text-muted-foreground">
//                     Found {comments.length} {comments.length === 1 ? 'result' : 'results'} for "{searchQuery}"
//                   </p>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleClearSearch}
//                     className="h-7 text-xs"
//                   >
//                     Clear
//                   </Button>
//                 </div>
//               )}

//               {/* Comments List */}
//               <div className="space-y-6">
//                 {comments.map((comment) => (
//                   <CommentItem
//                     key={comment.id}
//                     comment={comment}
//                     onReply={replyToComment}
//                     onLike={toggleLike}
//                     onFlag={flagComment}
//                     onEdit={editComment}
//                     onDelete={deleteComment}
//                     currentUser={user}
//                   />
//                 ))}
//               </div>

//               {/* Loading More Indicator */}
//               {loading && comments.length > 0 && (
//                 <div className="flex items-center justify-center py-4 gap-2">
//                   <Loader2 className="h-4 w-4 animate-spin text-primary" />
//                   <span className="text-sm text-muted-foreground">Loading more...</span>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default BookComments
import React, { useEffect, useState, useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Loader2,
  Search,
  SlidersHorizontal,
  RefreshCw,
  MessageSquare,
  X
} from 'lucide-react'
import { useComments } from '@/hooks/useComments'
import { AuthContext } from '@/contexts/authContext'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'
import CommentSkeleton from './CommentSkeleton'

const BookComments = ({ bookId, bookTitle }) => {
  const { user } = useContext(AuthContext)

  const [sortBy, setSortBy] = useState('-created_at')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    replyToComment,
    toggleLike,
    flagComment,
    editComment,
    deleteComment
  } = useComments(bookId)

  // Initial fetch
  useEffect(() => {
    if (bookId) {
      fetchComments({ ordering: sortBy })
    }
  }, [bookId, fetchComments, sortBy])

  /* ---------------- AUTH GUARDS ---------------- */

  const requireAuth = (fn) => {
    if (!user) {
      alert('Please log in to perform this action.')
      return
    }
    return fn
  }

  const safeAddComment = (data) =>
    requireAuth(() => addComment(data))

  const safeReply = (id, data) =>
    requireAuth(() => replyToComment(id, data))

  const safeLike = (id) =>
    requireAuth(() => toggleLike(id))

  const safeFlag = (id) =>
    requireAuth(() => flagComment(id))

  const safeEdit = (id, data) =>
    requireAuth(() => editComment(id, data))

  const safeDelete = (id) =>
    requireAuth(() => deleteComment(id))

  /* --------------------------------------------- */

  const handleSortChange = (value) => {
    setSortBy(value)
    fetchComments({ ordering: value, search: searchQuery })
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    fetchComments({ ordering: sortBy, search: searchQuery })
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    fetchComments({ ordering: sortBy })
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Discussion</CardTitle>
            <Badge variant="outline" className="text-xs">
              {comments.length} comments
            </Badge>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_at">Newest</SelectItem>
                <SelectItem value="created_at">Oldest</SelectItem>
                <SelectItem value="-like_count">Most liked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchComments({ ordering: sortBy })}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="relative mt-3">
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        {/* ADD COMMENT */}
        <div className="mb-6">
          {user ? (
            <CommentInput
              onSubmit={safeAddComment}
              placeholder={`Share your thoughts on "${bookTitle}"...`}
              currentUser={user}
            />
          ) : (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Log in to write a comment.
              </p>
              <Button size="sm">Log in</Button>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* COMMENTS */}
        {loading && comments.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-sm text-red-500">Failed to load comments</p>
          </div>
        )}

        {!loading && comments.length === 0 && !error && (
          <div className="text-center py-10 text-sm text-muted-foreground">
            No comments yet.
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onReply={safeReply}
              onLike={safeLike}
              onFlag={safeFlag}
              onEdit={safeEdit}
              onDelete={safeDelete}
            />
          ))}
        </div>

        {!user && comments.length > 0 && (
          <p className="text-xs text-center text-muted-foreground mt-6">
            Log in to like, reply, or manage comments.
          </p>
        )}

        {loading && comments.length > 0 && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BookComments
