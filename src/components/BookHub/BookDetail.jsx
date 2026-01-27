import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  CalendarDays,
  Loader2,
  AlertCircle,
  FileText,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
  Download,
  Eye,
  MoreVertical,
  Pencil,
  Upload,
  Settings,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import axios from 'axios'
import Loading from '@/Loading'
import BookComments from '@/components/bookhub/BookComments'
import { toast } from 'sonner'

const DEFAULT_BOOK_COVER = "/placeholder-book.png"

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const BookDetail = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [chapterSummaries, setChapterSummaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Edit states
  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false)
  const [editSummaryDialogOpen, setEditSummaryDialogOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [editBookLoading, setEditBookLoading] = useState(false)
  const [editSummaryLoading, setEditSummaryLoading] = useState(false)

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    short_desc: '',
    description: '',
    discussion_month: '',
    discussion_year: '',
    is_discussed: false,
    total_chapters: '',
    page_count: '',
    genre: '',
    isbn: ''
  })
  const [bookCoverFile, setBookCoverFile] = useState(null)
  const [bookCoverPreview, setBookCoverPreview] = useState(null)

  // Summary form state
  const [summaryForm, setSummaryForm] = useState({
    discussed_on: ''
  })
  const [summaryFile, setSummaryFile] = useState(null)
  const [summaryFileName, setSummaryFileName] = useState('')

  const bookCoverInputRef = useRef(null)
  const summaryFileInputRef = useRef(null)

  const { API_BASE_URL, user } = useContext(AuthContext)

  // Check if user is admin
  const isAdmin = localStorage.getItem("role") === 'ADMIN'

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  })

  const getAuthHeaderMultipart = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      'Content-Type': 'multipart/form-data'
    }
  })

  // Helper function to get proper image URL
  const getBookCoverUrl = (coverPath) => {
    if (!coverPath) return DEFAULT_BOOK_COVER
    if (coverPath.startsWith("http://localhost:8000")) {
      return coverPath.replace("http://localhost:8000", API_BASE_URL)
    }
    if (coverPath.startsWith("http://localhost:7000")) {
      return coverPath.replace("http://localhost:7000", API_BASE_URL)
    }
    if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
      return coverPath
    }
    return `${API_BASE_URL}${coverPath.startsWith('/') ? '' : '/'}${coverPath}`
  }

  // Helper function to get file URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath
    }
    return `${API_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // Download file handler
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const fullUrl = getFileUrl(fileUrl)
      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'chapter-summary.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      window.open(getFileUrl(fileUrl), '_blank')
    }
  }

  // Open file in new tab
  const handleViewFile = (fileUrl) => {
    window.open(getFileUrl(fileUrl), '_blank')
  }

  // Initialize book form when editing
  const handleEditBook = () => {
    if (book) {
      setBookForm({
        title: book.title || '',
        author: book.author || '',
        short_desc: book.short_desc || '',
        description: book.description || '',
        discussion_month: book.discussion_month || '',
        discussion_year: book.discussion_year?.toString() || '',
        is_discussed: book.is_discussed || false,
        total_chapters: book.total_chapters?.toString() || '',
        page_count: book.page_count?.toString() || '',
        genre: book.genre || '',
        isbn: book.isbn || ''
      })
      setBookCoverFile(null)
      setBookCoverPreview(null)
      setEditBookDialogOpen(true)
    }
  }

  // Handle book form changes
  const handleBookFormChange = (field, value) => {
    setBookForm(prev => ({ ...prev, [field]: value }))
  }

  // Handle book cover file selection
  const handleBookCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBookCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBookCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit book update
  const handleUpdateBook = async () => {
    try {
      setEditBookLoading(true)

      const formData = new FormData()
      
      // Append text fields
      Object.keys(bookForm).forEach(key => {
        if (bookForm[key] !== '' && bookForm[key] !== null && bookForm[key] !== undefined) {
          if (key === 'is_discussed') {
            formData.append(key, bookForm[key])
          } else if (key === 'total_chapters' || key === 'page_count' || key === 'discussion_year') {
            if (bookForm[key]) {
              formData.append(key, parseInt(bookForm[key]))
            }
          } else {
            formData.append(key, bookForm[key])
          }
        }
      })

      // Append cover image if selected
      if (bookCoverFile) {
        formData.append('cover_image', bookCoverFile)
      }

      const response = await axios.patch(
        `${API_BASE_URL}/bookhub/books/${bookId}/`,
        formData,
        getAuthHeaderMultipart()
      )

      setBook(response.data)
      setEditBookDialogOpen(false)
      toast.success('Book updated successfully!')

    } catch (err) {
      console.error('Failed to update book:', err)
      toast.error(err.response?.data?.detail || 'Failed to update book')
    } finally {
      setEditBookLoading(false)
    }
  }

  // Initialize summary form when editing
  const handleEditSummary = (chapter) => {
    setSelectedChapter(chapter)
    setSummaryForm({
      discussed_on: formatDateForInput(chapter.discussed_on)
    })
    setSummaryFile(null)
    setSummaryFileName('')
    setEditSummaryDialogOpen(true)
  }

  // Handle summary file selection
  const handleSummaryFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSummaryFile(file)
      setSummaryFileName(file.name)
    }
  }

  // Submit summary update
  const handleUpdateSummary = async () => {
    if (!selectedChapter) return

    try {
      setEditSummaryLoading(true)

      const formData = new FormData()
      
      if (summaryForm.discussed_on) {
        formData.append('discussed_on', summaryForm.discussed_on)
      }

      if (summaryFile) {
        formData.append('summary_file', summaryFile)
      }

      await axios.patch(
        `${API_BASE_URL}/bookhub/chapters/${selectedChapter.id}/update_summary/`,
        formData,
        getAuthHeaderMultipart()
      )

      // Refresh summaries
      const summaryResponse = await axios.get(
        `${API_BASE_URL}/bookhub/summaries/?book=${bookId}`,
        getAuthHeader()
      )
      setChapterSummaries(summaryResponse.data.chapters || [])

      setEditSummaryDialogOpen(false)
      setSelectedChapter(null)
      toast.success('Summary updated successfully!')

    } catch (err) {
      console.error('Failed to update summary:', err)
      toast.error(err.response?.data?.detail || 'Failed to update summary')
    } finally {
      setEditSummaryLoading(false)
    }
  }

  // Fetch book details and summaries
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const bookResponse = await axios.get(
          `${API_BASE_URL}/bookhub/books/${bookId}/`,
          getAuthHeader()
        )
        setBook(bookResponse.data)

        try {
          setSummaryLoading(true)
          const summaryResponse = await axios.get(
            `${API_BASE_URL}/bookhub/summaries/?book=${bookId}`,
            getAuthHeader()
          )
          setChapterSummaries(summaryResponse.data.chapters || [])
        } catch (summaryErr) {
          console.error('Failed to fetch summaries:', summaryErr)
          setChapterSummaries([])
        } finally {
          setSummaryLoading(false)
        }

      } catch (err) {
        console.error(err)
        setError('Failed to load book details.')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchBookDetails()
    }
  }, [bookId, API_BASE_URL])

  // Loading state
  if (loading) {
    return <Loading />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500">{error}</p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="min-h-screen mt-14 bg-gray-50">
      {/* Hero Section with Book Cover */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 blur-3xl scale-110"
            style={{ backgroundImage: `url(${getBookCoverUrl(book.cover_image)})` }}
          />
        </div>

        <div className="container mx-auto px-4 py-6 relative">
          {/* Back Button & Admin Actions */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50 whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Books
            </Button>

            {/* Admin Edit Button */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditBook}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Book
              </Button>
            )}
          </div>

          {/* Book Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={getBookCoverUrl(book.cover_image)}
                  alt={book.title}
                  className="w-48 h-72 md:w-56 md:h-80 object-cover rounded-xl shadow-2xl mx-auto lg:mx-0"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = DEFAULT_BOOK_COVER
                  }}
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 text-center lg:text-left min-w-0">
              {/* Status + Actions Row */}
              <div className="flex items-center justify-between mb-3 gap-3">
                {/* Left: Status Badges */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Badge className="text-xs px-2.5 py-1 whitespace-nowrap">
                    {book.is_discussed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Discussed
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </>
                    )}
                  </Badge>

                  <Badge variant="secondary" className="text-xs px-2.5 py-1 whitespace-nowrap">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {book.discussion_month} {book.discussion_year}
                  </Badge>
                </div>

                {/* Right: Save & Share */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bookmark className="h-12 w-12" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Share2 className="h-12 w-12" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-lg text-muted-foreground mb-4 truncate">
                by <span className="font-medium">{book.author}</span>
              </p>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6">
                {book.short_desc}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                {book.total_chapters && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                    <BookOpen className="h-4 w-4" />
                    {book.total_chapters} Chapters
                  </div>
                )}

                {book.page_count && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                    <FileText className="h-4 w-4" />
                    {book.page_count} Pages
                  </div>
                )}

                {chapterSummaries.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                    <Download className="h-4 w-4" />
                    {chapterSummaries.length} Summaries Available
                  </div>
                )}

                {book.genre && (
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {book.genre}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button className="gap-2 whitespace-nowrap">
                  <BookOpen className="h-4 w-4" />
                  Start Reading
                </Button>

                <Button variant="outline" className="gap-2 whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Overview & Summary
            </TabsTrigger>
            <TabsTrigger value="discussion" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Discussion
            </TabsTrigger>
          </TabsList>

          {/* Overview & Summary Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About the Book */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">About This Book</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {book.description || book.short_desc}
                    </p>
                  </CardContent>
                </Card>

                {/* Chapter Summaries Section */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg text-nowrap">Chapter Summaries</CardTitle>
                      </div>
                      {chapterSummaries.length > 0 && (
                        <Badge variant="blue">
                          {chapterSummaries.length} available
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Download chapter summaries submitted by book club members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {summaryLoading ? (
                      <div className="flex items-center justify-center py-12 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">Loading summaries...</span>
                      </div>
                    ) : chapterSummaries.length > 0 ? (
                      <div className="space-y-3">
                        {chapterSummaries
                          .sort((a, b) => a.chapter_number - b.chapter_number)
                          .map((chapter) => (
                            <div
                              key={chapter.id}
                              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            >
                              {/* Chapter Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {chapter.chapter_number}. {chapter.chapter_title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-nowrap text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {chapter.submitted_by?.name || 'Unknown'}
                                  </span>
                                  <span className="text-xs text-nowrap text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(chapter.discussed_on)}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewFile(chapter.summary_file)}
                                  className="gap-1.5 px-3"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(
                                      chapter.summary_file,
                                      `Chapter-${chapter.chapter_number}-${chapter.chapter_title}.pdf`
                                    )
                                  }
                                  className="gap-1.5 px-3"
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="hidden sm:inline">Download</span>
                                </Button>

                                {/* Admin Edit Button */}
                                {isAdmin && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditSummary(chapter)}>
                                        <Pencil className="h-4 w-4 mr-2 text-nowrap" />
                                        Edit 
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleEditSummary(chapter)}>
                                        <Upload className="h-4 w-4 mr-2 text-nowrap" />
                                        Replace 
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="h-16 w-16 min-w-[64px] min-h-[64px] rounded-full bg-muted flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            No Summaries Available Yet
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Chapter summaries will appear here after they are submitted.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Chapters List (if different from summaries) */}
                {book.chapters && book.chapters.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">All Chapters</CardTitle>
                        <Badge variant="secondary">
                          {book.chapters.length} chapters
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.chapters.map((chapter, index) => {
                          const hasSummary = chapterSummaries.some(
                            s => s.chapter_number === index + 1
                          )

                          return (
                            <div
                              key={chapter.id || index}
                              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                            >
                              <div className="h-8 w-8 min-w-[32px] min-h-[32px] rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {chapter.title}
                                </h4>
                                {chapter.page_count && (
                                  <p className="text-xs text-muted-foreground">
                                    {chapter.page_count} pages
                                  </p>
                                )}
                              </div>
                              {hasSummary && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                  Summary Available
                                </Badge>
                              )}
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Summary Contributors */}
                {chapterSummaries.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Contributors</CardTitle>
                      <CardDescription className="text-nowrap">
                        Members who submitted summaries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[...new Map(
                          chapterSummaries.map(s => [s.submitted_by?.id, s.submitted_by])
                        ).values()]
                          .filter(Boolean)
                          .map((contributor) => (
                            <div
                              key={contributor.id}
                              className="flex items-center gap-3"
                            >
                              <div className="h-8 w-8 min-w-[32px] min-h-[32px] rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {contributor.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {chapterSummaries.filter(
                                    s => s.submitted_by?.id === contributor.id
                                  ).length} summaries
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Book Details Card */}
                {/* <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Book Details</CardTitle>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleEditBook}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Author</span>
                      <span className="font-medium">{book.author}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discussion</span>
                      <span className="font-medium">
                        {book.discussion_month} {book.discussion_year}
                      </span>
                    </div>
                    {book.total_chapters && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Chapters</span>
                          <span className="font-medium">{book.total_chapters}</span>
                        </div>
                      </>
                    )}
                    {book.page_count && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pages</span>
                          <span className="font-medium">{book.page_count}</span>
                        </div>
                      </>
                    )}
                    {book.genre && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Genre</span>
                          <span className="font-medium">{book.genre}</span>
                        </div>
                      </>
                    )}
                    {book.isbn && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">ISBN</span>
                          <span className="font-medium text-xs">{book.isbn}</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={book.is_discussed ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {book.is_discussed ? "Discussed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion">
            <BookComments bookId={parseInt(bookId)} bookTitle={book.title} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Book Dialog */}
      <Dialog open={editBookDialogOpen} onOpenChange={setEditBookDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Cover Image Preview & Upload */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={bookCoverPreview || getBookCoverUrl(book.cover_image)}
                    alt="Book cover"
                    className="w-24 h-36 object-cover rounded-lg border"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    ref={bookCoverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBookCoverChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => bookCoverInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload New Cover
                  </Button>
                  {bookCoverFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {bookCoverFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Title & Author */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => handleBookFormChange('title', e.target.value)}
                  placeholder="Book title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => handleBookFormChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_desc">Short Description</Label>
              <Textarea
                id="short_desc"
                value={bookForm.short_desc}
                onChange={(e) => handleBookFormChange('short_desc', e.target.value)}
                placeholder="Brief description of the book"
                rows={2}
              />
            </div>

            {/* Full Description */}
            {/* <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={bookForm.description}
                onChange={(e) => handleBookFormChange('description', e.target.value)}
                placeholder="Detailed description of the book"
                rows={4}
              />
            </div> */}

            <Separator />

            {/* Discussion Month & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discussion_month">Discussion Month</Label>
                <Select
                  value={bookForm.discussion_month}
                  onValueChange={(value) => handleBookFormChange('discussion_month', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discussion_year">Discussion Year</Label>
                <Input
                  id="discussion_year"
                  type="number"
                  value={bookForm.discussion_year}
                  onChange={(e) => handleBookFormChange('discussion_year', e.target.value)}
                  placeholder="2024"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            {/* Chapters, Pages, Genre */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_chapters">Total Chapters</Label>
                <Input
                  id="total_chapters"
                  type="number"
                  value={bookForm.total_chapters}
                  onChange={(e) => handleBookFormChange('total_chapters', e.target.value)}
                  placeholder="12"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page_count">Page Count</Label>
                <Input
                  id="page_count"
                  type="number"
                  value={bookForm.page_count}
                  onChange={(e) => handleBookFormChange('page_count', e.target.value)}
                  placeholder="300"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={bookForm.genre}
                  onChange={(e) => handleBookFormChange('genre', e.target.value)}
                  placeholder="Non-fiction"
                />
              </div>
            </div>

            {/* ISBN */}
            {/* <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={bookForm.isbn}
                onChange={(e) => handleBookFormChange('isbn', e.target.value)}
                placeholder="978-0-123456-78-9"
              />
            </div> */}

            {/* Is Discussed Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_discussed">Mark as Discussed</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle if the book discussion has been completed
                </p>
              </div>
              <Switch
                id="is_discussed"
                className="shrink-0 ml-4"
                checked={bookForm.is_discussed}
                onCheckedChange={(checked) => handleBookFormChange('is_discussed', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditBookDialogOpen(false)}
              disabled={editBookLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBook}
              disabled={editBookLoading}
              className="gap-2"
            >
              {editBookLoading ? (
                <>
                 
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Summary Dialog */}
      <Dialog open={editSummaryDialogOpen} onOpenChange={setEditSummaryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-nowrap">Edit Chapter Summary</DialogTitle>
            <DialogDescription className="text-nowrap">
              {selectedChapter && (
                <>
                  Chapter {selectedChapter.chapter_number}: {selectedChapter.chapter_title}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Current File Info */}
            {selectedChapter?.summary_file && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">Current File:</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {selectedChapter.summary_file.split('/').pop()}
                </p>
              </div>
            )}

            {/* Upload New File */}
            <div className="space-y-2">
              <Label>Replace Summary PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={summaryFileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleSummaryFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => summaryFileInputRef.current?.click()}
                  className="gap-2 flex-1"
                >
                  <Upload className="h-4 w-4" />
                  {summaryFileName || 'Choose PDF File'}
                </Button>
              </div>
              {summaryFileName && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {summaryFileName}
                </div>
              )}
            </div>

            {/* Discussion Date */}
            <div className="space-y-2">
              <Label htmlFor="discussed_on">Discussion Date</Label>
              <Input
                id="discussed_on"
                type="date"
                value={summaryForm.discussed_on}
                onChange={(e) => setSummaryForm(prev => ({
                  ...prev,
                  discussed_on: e.target.value
                }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditSummaryDialogOpen(false)
                setSelectedChapter(null)
              }}
              disabled={editSummaryLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSummary}
              disabled={editSummaryLoading || (!summaryFile && !summaryForm.discussed_on)}
              className="gap-2"
            >
              {editSummaryLoading ? (
                <>
                 
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Summary
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookDetail