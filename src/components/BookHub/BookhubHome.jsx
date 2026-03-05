import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Calendar,
  Clock,
  BookMarked,
  CheckCircle2,
  CalendarDays,
  Eye,
  MessageCircle,
  AlertCircle,
  Plus,
  Users,
  Check,
  X,
  Loader2,
  Search,
  PlayCircle,
  Vote,
  Trophy,
  BarChart3,
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import { TECHNO_BASE_URL } from '@/environment'
import axios from 'axios'
import Loading from '@/Loading'
import LoginModal from '@/feature-module/auth/login/login-3'
import { LIMITS } from '@/utils/validation'

const DEFAULT_BOOK_COVER = null

// ── Poll Option ──
const PollOptionCard = ({ option, poll, onVote, votingLoading, getBookCoverUrl, books }) => {
  const isVotedFor = poll.voted_for?.option_id === option.id
  const hasVoted = poll.has_voted
  const totalVotes = poll.total_votes || 0
  const percentage = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0
  const bookData = books.find(b => b.id === option.book)

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${isVotedFor
          ? 'border-primary bg-primary/5'
          : hasVoted
            ? 'border-border'
            : 'border-border hover:border-primary/40 cursor-pointer'
        }`}
      onClick={() => {
        if (!hasVoted && poll.is_voting_open && !votingLoading) {
          onVote(poll.id, option.id)
        }
      }}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox / radio */}
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isVotedFor ? 'bg-primary border-primary' : 'border-muted-foreground/30'
          }`}>
          {isVotedFor && <Check className="h-3 w-3 text-white" />}
        </div>

        {/* Book thumbnail */}
        {bookData?.cover_image && (
          <img
            src={getBookCoverUrl(bookData.cover_image)}
            alt={option.book_title}
            className="w-8 h-11 object-cover rounded shadow-sm shrink-0"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{option.book_title}</p>
          <p className="text-xs text-muted-foreground">by {option.book_author}</p>
        </div>

        {/* Vote count */}
        {hasVoted && (
          <span className="text-xs text-muted-foreground shrink-0">{percentage}%</span>
        )}
      </div>

      {/* Progress bar after voting */}
      {hasVoted && (
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isVotedFor ? 'bg-primary' : 'bg-muted-foreground/25'
              }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ── Poll Card ──
const PollCard = ({ poll, onVote, votingLoading, isAdmin, onActivate, activatingId, getBookCoverUrl, books }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant={poll.status === 'ACTIVE' ? 'default' : 'secondary'}
                className="text-[10px]"
              >
                {poll.status === 'ACTIVE' && poll.is_voting_open ? 'Voting Open' : poll.status}
              </Badge>
            </div>
            <CardTitle className="text-sm">{poll.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Users className="h-3.5 w-3.5" />
            {poll.total_votes}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        {poll.options.map((option) => (
          <PollOptionCard
            key={option.id}
            option={option}
            poll={poll}
            onVote={onVote}
            votingLoading={votingLoading}
            getBookCoverUrl={getBookCoverUrl}
            books={books}
          />
        ))}

        {poll.has_voted && poll.voted_for && (
          <p className="text-xs text-muted-foreground pt-1">
            You voted for <strong>{poll.voted_for.book}</strong>
          </p>
        )}

        {poll.winner_book_title && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 pt-1">
            <Trophy className="h-3.5 w-3.5" />
            Winner: <strong>{poll.winner_book_title}</strong>
          </div>
        )}
      </CardContent>

      {isAdmin && poll.status === 'DRAFT' && (
        <CardFooter className="pt-0 pb-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 text-xs"
            onClick={() => onActivate(poll.id)}
            disabled={activatingId === poll.id}
          >
            {activatingId === poll.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5" />
            )}
            Activate Poll
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// ── Create Poll Dialog ──
const CreatePollDialog = ({ open, onOpenChange, books, onSubmit, loading, getBookCoverUrl }) => {
  const [title, setTitle] = useState('')
  const [selectedBookIds, setSelectedBookIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books
    const q = searchQuery.toLowerCase()
    return books.filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    )
  }, [books, searchQuery])

  const toggleBook = (id) => {
    setSelectedBookIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!title.trim() || selectedBookIds.length < 2) return
    onSubmit({ title: title.trim(), book_ids: selectedBookIds })
  }

  const handleClose = (val) => {
    if (!val) {
      setTitle('')
      setSelectedBookIds([])
      setSearchQuery('')
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Poll</DialogTitle>
          <DialogDescription>
            Select at least 2 books for members to vote on.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="poll-title" className="text-sm">Title</Label>
            <Input
              id="poll-title"
              placeholder="e.g., Vote for March 2026!"
              value={title}
              maxLength={LIMITS.POLL_TITLE}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">
              Books ({selectedBookIds.length} selected)
            </Label>

            {selectedBookIds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedBookIds.map(id => {
                  const book = books.find(b => b.id === id)
                  if (!book) return null
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1 cursor-pointer" onClick={() => toggleBook(id)}>
                      {book.title}
                      <X className="h-3 w-3" />
                    </Badge>
                  )
                })}
              </div>
            )}

            <div className="relative">

              <Input
                placeholder="Search books..."
                value={searchQuery}
                maxLength={LIMITS.SEARCH_QUERY}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>

            <div className="border rounded-lg max-h-44 overflow-y-auto divide-y">
              {filteredBooks.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground text-center">No books found</p>
              ) : (
                filteredBooks.map(book => {
                  const selected = selectedBookIds.includes(book.id)
                  return (
                    <div
                      key={book.id}
                      className={`flex items-center gap-2.5 p-2 cursor-pointer text-sm ${selected ? 'bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      onClick={() => toggleBook(book.id)}
                    >
                      <div className={`h-4 w-1 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                        }`}>
                        {selected && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm">{book.title}</p>
                        <p className="text-xs text-muted-foreground">by {book.author}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || selectedBookIds.length < 2}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Book Card ──
const BookCard = ({ book, getBookCoverUrl, onClick, variant = "upcoming" }) => {
  const isDiscussed = variant === "discussed"

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={onClick}>
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={getBookCoverUrl(book.cover_image)}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_BOOK_COVER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <Badge className={`text-white text-[10px] px-2 py-0.5 ${isDiscussed ? 'bg-green-500' : 'bg-amber-500'}`}>
            {isDiscussed && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
            {isDiscussed ? 'Discussed' : 'Upcoming'}
          </Badge>
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-1.5">
          {book.total_chapters && (
            <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">
              {book.total_chapters} chapters
            </Badge>
          )}
          {book.has_summary && (
            <Badge className="bg-primary/80 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">Summary</Badge>
          )}
          {book.comment_count > 0 && (
            <Badge className="bg-blue-500/80 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm gap-1">
              <MessageCircle className="h-2.5 w-2.5" />{book.comment_count}
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="gap-2 shadow-lg">
            <Eye className="h-4 w-4" />View Details
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{book.short_desc}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1.5 group-hover:bg-[#2196F3] group-hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onClick() }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {isDiscussed ? 'Read Summary' : 'View Book'}
        </Button>
      </div>
    </Card>
  )
}

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)

const AccessRequestCard = ({ accessState, requestReason, setRequestReason, onSubmit, loading }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <Card className="max-w-lg w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Request BookHub Access</CardTitle>
        <CardDescription>Join our reading community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {accessState.status === "pending" ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Request under review</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/70">Your request is awaiting approval.</p>
          </div>
        ) : accessState.status === "rejected" ? (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Request was not approved</p>
              <p className="text-xs text-red-700/80 dark:text-red-300/70">Contact support if you believe this was a mistake.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for access</label>
            <textarea
              className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="I want to join monthly book discussions..."
              value={requestReason}
              maxLength={LIMITS.ACCESS_REASON}
              onChange={(e) => setRequestReason(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {accessState.status === "not_requested" && (
          <Button className="w-full" onClick={onSubmit} disabled={loading || !requestReason.trim()}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        )}
      </CardFooter>
    </Card>
  </div>
)

// ── Main Component ──
export const BookhubHome = () => {
  const navigate = useNavigate()
  const { API_BASE_URL, user, hasRole, hasSubrole } = useContext(AuthContext)

  const [activeTab, setActiveTab] = useState("upcoming")
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessState, setAccessState] = useState(null)
  const [requestReason, setRequestReason] = useState("")
  const [requestLoading, setRequestLoading] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const [polls, setPolls] = useState([])
  const [votingLoading, setVotingLoading] = useState(false)
  const [createPollOpen, setCreatePollOpen] = useState(false)
  const [createPollLoading, setCreatePollLoading] = useState(false)
  const [activatingId, setActivatingId] = useState(null)

  const isAdmin = hasRole('ADMIN') || hasSubrole('BOOKHUB_MANAGER')
  const isLoggedIn = !!localStorage.getItem("accessToken") || !!user

  const getBookCoverUrl = (coverPath) => {
    if (!coverPath) return DEFAULT_BOOK_COVER
    if (coverPath.startsWith("http://localhost:8000"))
      return coverPath.replace("http://localhost:8000", API_BASE_URL)
    if (coverPath.startsWith("http://localhost:7000"))
      return coverPath.replace("http://localhost:7000", API_BASE_URL)
    if (coverPath.startsWith("http://") || coverPath.startsWith("https://"))
      return coverPath
    return `${API_BASE_URL}${coverPath.startsWith('/') ? '' : '/'}${coverPath}`
  }

  const navigateToBook = (bookId) => navigate(`/bookhub/book/${bookId}`)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) { setLoading(false); return }

        const headers = { Authorization: `Bearer ${accessToken}` }
        const [booksRes, pollsRes] = await Promise.all([
          axios.get(`${TECHNO_BASE_URL}/bookhub/books/`, { headers }),
          axios.get(`${TECHNO_BASE_URL}/bookhub/polls/`, { headers }).catch(() => ({ data: [] })),
        ])
        setBooks(booksRes.data)
        setPolls(pollsRes.data)
      } catch (err) {
        const data = err?.response?.data
        if (data?.error === "access_denied" || data?.error === "bookhub_access_denied") {
          setAccessState({ status: data.status || "not_requested", hasRequested: data.has_requested === "True" })
          return
        }
        setError('Failed to load books. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const refreshPolls = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      const res = await axios.get(`${TECHNO_BASE_URL}/bookhub/polls/`, { headers })
      setPolls(res.data)
    } catch { }
  }

  const handleVote = async (pollId, optionId) => {
    try {
      setVotingLoading(true)
      const headers = { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      await axios.post(`${TECHNO_BASE_URL}/bookhub/polls/${pollId}/vote/`, { poll_option_id: optionId }, { headers })
      await refreshPolls()
    } catch (err) {
      alert(err?.response?.data?.error || err?.response?.data?.detail || 'Failed to vote')
    } finally {
      setVotingLoading(false)
    }
  }

  const handleCreatePoll = async ({ title, book_ids }) => {
    try {
      setCreatePollLoading(true)
      const headers = { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      await axios.post(`${TECHNO_BASE_URL}/bookhub/polls/create/`, { title, book_ids }, { headers })
      await refreshPolls()
      setCreatePollOpen(false)
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to create poll')
    } finally {
      setCreatePollLoading(false)
    }
  }

  const handleActivatePoll = async (pollId) => {
    try {
      setActivatingId(pollId)
      const headers = { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      await axios.post(`${TECHNO_BASE_URL}/bookhub/polls/${pollId}/activate/`, {}, { headers })
      await refreshPolls()
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to activate poll')
    } finally {
      setActivatingId(null)
    }
  }

  const handleRequestAccess = async () => {
    if (!requestReason.trim()) return
    try {
      setRequestLoading(true)
      await axios.post(`${TECHNO_BASE_URL}/bookhub/access/request/`, { reason: requestReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } })
      setAccessState({ status: "pending", hasRequested: true })
    } catch { alert("Failed to submit access request.") }
    finally { setRequestLoading(false) }
  }

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const currentBook = books.find(b =>
    b.discussion_month === currentMonth && b.discussion_year === currentYear &&
    (b.status === "DISCUSSING" || b.status === "RE_READ")
  ) || books.find(b => b.status === "DISCUSSING")

  const upcomingBooks = books.filter(b => b.status === "UPCOMING").sort((a, b) => {
    if (a.discussion_year !== b.discussion_year) return a.discussion_year - b.discussion_year
    return monthOrder.indexOf(a.discussion_month) - monthOrder.indexOf(b.discussion_month)
  })

  const discussedBooks = books.filter(b => b.status === "DISCUSSED").sort((a, b) => {
    if (b.discussion_year !== a.discussion_year) return b.discussion_year - a.discussion_year
    return monthOrder.indexOf(b.discussion_month) - monthOrder.indexOf(a.discussion_month)
  })

  const activePolls = polls.filter(p => p.status === 'ACTIVE')
  const draftPolls = polls.filter(p => p.status === 'DRAFT')
  const closedPolls = polls.filter(p => p.status === 'CLOSED' || p.status === 'DECIDED')

  if (loading) return <Loading />

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}
          onForgot={() => { setLoginModalOpen(false); navigate('/forgot-password') }} />
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            {error || 'You need to login first to view BookHub'}
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={() => setLoginModalOpen(true)}>Go to Login</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  if (accessState && !isAdmin) {
    return <AccessRequestCard accessState={accessState} requestReason={requestReason}
      setRequestReason={setRequestReason} onSubmit={handleRequestAccess} loading={requestLoading} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}
          onForgot={() => { setLoginModalOpen(false); navigate('/forgot-password') }} />
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="font-semibold text-lg">{error}</p>
          <div className="flex gap-3 justify-center pt-4">
            {error.includes("login") && <Button onClick={() => setLoginModalOpen(true)}>Go to Login</Button>}
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  if (books.length === 0 && polls.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <EmptyState icon={BookOpen} title="No Books Available" description="Check back later!" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <CreatePollDialog
        open={createPollOpen}
        onOpenChange={setCreatePollOpen}
        books={books}
        onSubmit={handleCreatePoll}
        loading={createPollLoading}
        getBookCoverUrl={getBookCoverUrl}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* ── Polls Section ── */}
        {(activePolls.length > 0 || (isAdmin && draftPolls.length > 0)) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Polls</h2>
              </div>
              {isAdmin && (
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setCreatePollOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  New Poll
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePolls.map(poll => (
                <PollCard key={poll.id} poll={poll} onVote={handleVote} votingLoading={votingLoading}
                  isAdmin={isAdmin} onActivate={handleActivatePoll} activatingId={activatingId}
                  getBookCoverUrl={getBookCoverUrl} books={books} />
              ))}
              {isAdmin && draftPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} onVote={handleVote} votingLoading={votingLoading}
                  isAdmin={isAdmin} onActivate={handleActivatePoll} activatingId={activatingId}
                  getBookCoverUrl={getBookCoverUrl} books={books} />
              ))}
            </div>
          </section>
        )}

        {/* Admin CTA when no polls */}
        {isAdmin && activePolls.length === 0 && draftPolls.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-medium text-sm">Create a Book Poll</p>
                <p className="text-xs text-muted-foreground">Let members vote on the next book</p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setCreatePollOpen(true)}>
                <Plus className="h-4 w-4" />Create
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Past Polls */}
        {closedPolls.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">Past Polls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {closedPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} onVote={handleVote} votingLoading={votingLoading}
                  isAdmin={isAdmin} onActivate={handleActivatePoll} activatingId={activatingId}
                  getBookCoverUrl={getBookCoverUrl} books={books} />
              ))}
            </div>
          </section>
        )}

        {(polls.length > 0 && books.length > 0) && <Separator />}

        {/* ── Current Book ── */}
        {currentBook && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary text-nowrap text-primary-foreground text-xs px-2.5 py-1">
                <Clock className="h-3 w-3 mr-1.5" />Currently Reading
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentBook.discussion_month} {currentBook.discussion_year}
              </span>
            </div>

            <Card
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigateToBook(currentBook.id)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-44 md:w-52 bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-5 flex items-center justify-center">
                  <img
                    src={getBookCoverUrl(currentBook.cover_image)}
                    alt={currentBook.title}
                    className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-md shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_BOOK_COVER }}
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">
                        {currentBook.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">by {currentBook.author}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{currentBook.short_desc}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                        <CalendarDays className="h-3 w-3" />{currentBook.discussion_month} {currentBook.discussion_year}
                      </Badge>
                      {currentBook.total_chapters && (
                        <Badge variant="primary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                          <BookOpen className="h-3 w-3" />{currentBook.total_chapters} Chapters
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs px-2 py-0.5 gap-1">
                        {currentBook.status === "DISCUSSING" ? (
                          <><CheckCircle2 className="h-3 w-3" />DISCUSSING</>
                        ) : (
                          <><Clock className="h-3 w-3" />Re-Read</>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    <Button size="sm" className="gap-1.5 h-9 px-4 text-sm"
                      onClick={(e) => { e.stopPropagation(); navigateToBook(currentBook.id) }}>
                      <BookOpen className="h-4 w-4" />View Book
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 h-9 px-4 text-sm"
                      onClick={(e) => e.stopPropagation()}>
                      <Calendar className="h-4 w-4" />Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ── Book Tabs ── */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="upcoming" className="gap-2">
                <Clock className="h-4 w-4" />Upcoming ({upcomingBooks.length})
              </TabsTrigger>
              <TabsTrigger value="discussed" className="gap-2">
                <BookMarked className="h-4 w-4" />Discussed ({discussedBooks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingBooks.length === 0 ? (
                <EmptyState icon={Clock} title="No Upcoming Books" description="Check back later for new books." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {upcomingBooks.map(book => (
                    <BookCard key={book.id} book={book} getBookCoverUrl={getBookCoverUrl}
                      onClick={() => navigateToBook(book.id)} variant="upcoming" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussed">
              {discussedBooks.length === 0 ? (
                <EmptyState icon={BookMarked} title="No Discussed Books" description="Discussed books will appear here." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {discussedBooks.map(book => (
                    <BookCard key={book.id} book={book} getBookCoverUrl={getBookCoverUrl}
                      onClick={() => navigateToBook(book.id)} variant="discussed" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}

export default BookhubHome