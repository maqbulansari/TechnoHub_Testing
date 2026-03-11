import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
  X,
  Plus
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import { TECHNO_BASE_URL } from '@/environment'
import axios from 'axios'
import Loading from '@/Loading'
import BookComments from './BookComments'
import { toast } from 'sonner'

const DEFAULT_BOOK_COVER = "/placeholder-book.png"

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Access request UI moved to BookhubHome; BookDetail assumes access is managed there.

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
  const [isAddingSummary, setIsAddingSummary] = useState(false)

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
    isbn: '',
    status: '',
  })
  const [bookCoverFile, setBookCoverFile] = useState(null)
  const [bookCoverPreview, setBookCoverPreview] = useState(null)

  // Summary form state
  const [summaryForm, setSummaryForm] = useState({
    discussed_on: '',
    chapter_number: '',
    chapter_title: '',
  })
  const [summaryFile, setSummaryFile] = useState(null)
  const [summaryFileName, setSummaryFileName] = useState('')

  const bookCoverInputRef = useRef(null)
  const summaryFileInputRef = useRef(null)

  const { API_BASE_URL, user, hasRole, hasSubrole } = useContext(AuthContext)

  // Treat BOOKHUB_MANAGER as admin for BookHub pages so they have full bookhub management access
  const isAdmin = hasRole('ADMIN') || hasSubrole('BOOKHUB_MANAGER')

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  })

  const getAuthHeaderMultipart = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      'Content-Type': 'multipart/form-data'
    }
  })

  const STATUS_TRANSITIONS = {
    UPCOMING: ["DISCUSSING"],
    DISCUSSING: ["DISCUSSED"],
    DISCUSSED: ["RE-READ"],
    "RE-READ": ["DISCUSSING"]
  }
  const currentStatus =
    book?.status === "RE_READ" ? "RE-READ" : book?.status

  const allowedStatuses = [
    currentStatus,
    ...(STATUS_TRANSITIONS[currentStatus] || [])
  ]

  // ──────────────────────────────────────────────
  // Compute the next chapter number for "Add"
  // ──────────────────────────────────────────────
  const getNextChapterNumber = () => {
    if (!chapterSummaries || chapterSummaries.length === 0) return 1
    const maxChapter = Math.max(
      ...chapterSummaries.map((ch) => ch.chapter_number || 0)
    )
    return maxChapter + 1
  }

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

  const getFileUrl = (filePath) => {
    if (!filePath) return null
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath
    }
    return `${API_BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // Access/request logic moved to BookhubHome; BookDetail will redirect on access errors.

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

  const handleViewFile = (fileUrl) => {
    window.open(getFileUrl(fileUrl), '_blank')
  }

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
        isbn: book.isbn || '',
        status: book.status === "RE_READ" ? "RE-READ" : book.status || '',
      })
      setBookCoverFile(null)
      setBookCoverPreview(null)
      setEditBookDialogOpen(true)
    }
  }

  const handleBookFormChange = (field, value) => {
    setBookForm(prev => ({ ...prev, [field]: value }))
  }

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

  const handleUpdateBook = async () => {
    if (!isAdmin) {
      toast.error('Not authorized')
      return
    }
    try {
      setEditBookLoading(true)

      const formData = new FormData()
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

      if (bookCoverFile) {
        formData.append('cover_image', bookCoverFile)
      }

      const response = await axios.patch(
        `${TECHNO_BASE_URL}/bookhub/books/${bookId}/`,
        formData,
        getAuthHeaderMultipart()
      )

      if (bookForm.status && bookForm.status !== book.status) {
        await axios.patch(
          `${TECHNO_BASE_URL}/bookhub/books/${bookId}/change_status/`,
          { status: bookForm.status },
          getAuthHeader()
        )
      }

      setBook(response.data)
      setEditBookDialogOpen(false)
      toast.success('Book updated successfully!')
    }
    catch (err) {
      console.error('Failed to update book:', err)

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to update book'

      toast.error(errorMessage)

      // Optional: show pending chapters
      if (err.response?.data?.pending_chapters) {
        console.log(
          "Pending chapters:",
          err.response.data.pending_chapters
        )
      }
    }

    finally {
      setEditBookLoading(false)
    }
  }


  const handleDeleteSummary = async (chapter) => {
    if (!isAdmin) {
      toast.error('Not authorized')
      return
    }
    try {
    
      await axios.delete(
        `${TECHNO_BASE_URL}/bookhub/chapters/delete-summary/`,
        {
          ...getAuthHeader(),
          data: { chapter_number: chapter.chapter_number } 
        }
      )

      // Refresh summaries after delete
      const summaryResponse = await axios.get(
        `${TECHNO_BASE_URL}/bookhub/summaries/?book=${bookId}`,
        getAuthHeader()
      )

      setChapterSummaries(summaryResponse.data.chapters || [])

      toast.success("Summary deleted successfully!")
    } catch (err) {
      console.error("Failed to delete summary:", err)
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to delete summary"
      )
    }
  }


  // ──────────────────────────────────────────────
  // Open the summary dialog for EDITING an existing chapter
  // ──────────────────────────────────────────────
  const handleEditSummary = (chapter) => {
    setSelectedChapter(chapter)
    setIsAddingSummary(false)
    setSummaryForm({
      discussed_on: formatDateForInput(chapter.discussed_on),
      chapter_number: chapter.chapter_number?.toString() || '',
      chapter_title: chapter.chapter_title || '',
    })
    setSummaryFile(null)
    setSummaryFileName('')
    setEditSummaryDialogOpen(true)
  }

  // ──────────────────────────────────────────────
  // Open the summary dialog for ADDING a new chapter summary
  // ──────────────────────────────────────────────
  const handleAddSummary = () => {
    const nextNum = getNextChapterNumber()
    setSelectedChapter(null) // No existing chapter
    setIsAddingSummary(true)
    setSummaryForm({
      discussed_on: '',
      chapter_number: nextNum.toString(),
      chapter_title: '',
    })
    setSummaryFile(null)
    setSummaryFileName('')
    setEditSummaryDialogOpen(true)
  }

  const handleSummaryFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSummaryFile(file)
      setSummaryFileName(file.name)
    }
  }

  // ──────────────────────────────────────────────
  // Submit: CREATE or UPDATE summary
  // ──────────────────────────────────────────────
  const handleUpdateSummary = async () => {
    if (!isAdmin) {
      toast.error('Not authorized')
      return
    }
    try {
      setEditSummaryLoading(true)

      const formData = new FormData()

      if (summaryFile) {
        formData.append('summary_file', summaryFile)
      }

      if (isAddingSummary) {
        // ─── CREATE ───
        formData.append('book', bookId)
        formData.append('chapter_number', summaryForm.chapter_number)
        formData.append('chapter_title', summaryForm.chapter_title)

        await axios.post(
          `${TECHNO_BASE_URL}/bookhub/chapters/upload-summary/`,
          formData,
          getAuthHeaderMultipart()
        )
      } else {
        // ─── UPDATE: always send chapter_number and chapter_title ───
        formData.append('chapter_id', selectedChapter.id)
        formData.append('chapter_number', summaryForm.chapter_number)
        formData.append('chapter_title', summaryForm.chapter_title)

        await axios.patch(
          `${TECHNO_BASE_URL}/bookhub/chapters/update-summary/`,
          formData,
          getAuthHeaderMultipart()
        )
      }

      // Refresh summaries after save
      const summaryResponse = await axios.get(
        `${TECHNO_BASE_URL}/bookhub/summaries/?book=${bookId}`,
        getAuthHeader()
      )
      setChapterSummaries(summaryResponse.data.chapters || [])

      setEditSummaryDialogOpen(false)
      setSelectedChapter(null)
      setIsAddingSummary(false)

      toast.success(
        isAddingSummary
          ? "Summary added successfully!"
          : "Summary updated successfully!"
      )
    } catch (err) {
      console.error('Failed to save summary:', err)
      toast.error(err.response?.data?.detail || 'Failed to save summary')
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

        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          setError("You need to login first to view book details")
          setLoading(false)
          return
        }

        const bookResponse = await axios.get(
          `${TECHNO_BASE_URL}/bookhub/books/${bookId}/`,
          getAuthHeader()
        )
        setBook(bookResponse.data)

        try {
          setSummaryLoading(true)
          const summaryResponse = await axios.get(
            `${TECHNO_BASE_URL}/bookhub/summaries/?book=${bookId}`,
            getAuthHeader()
          )
          setChapterSummaries(summaryResponse.data.chapters || [])
        } catch (summaryErr) {
          const summaryData = summaryErr?.response?.data
          if (summaryData?.error === "bookhub_access_denied") {
            navigate('/bookhub')
            setLoading(false)
            return
          }
          console.error('Failed to fetch summaries:', summaryErr)
          setChapterSummaries([])
        } finally {
          setSummaryLoading(false)
        }
      } catch (err) {
        const data = err?.response?.data
        if (data?.error === "access_denied") {
          navigate('/bookhub')
          return
        }
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

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12" />
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
              {error}
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate('/bookhub')}>
              Back to BookHub
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="min-h-screen mt-14 bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 blur-3xl scale-110"
            style={{ backgroundImage: `url(${getBookCoverUrl(book.cover_image)})` }}
          />
        </div>

        <div className="container mx-auto px-4 py-6 relative">
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

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={getBookCoverUrl(book.cover_image)}
                  alt={book.title}
                  className="w-48 h-72 md:w-56 md:h-80 object-cover rounded-xl shadow-2xl mx-auto lg:mx-0"
                  onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }} 
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left min-w-0">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Badge className="text-xs px-2.5 py-1 whitespace-nowrap">
                    {book.status === 'DISCUSSING' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        DISCUSSING
                      </>
                    ) : book.status === 'UPCOMING' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        UPCOMING
                      </>) : book.status === 'DISCUSSED' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          DISCUSSED
                        </>) : (<>
                          <Clock className="h-3 w-3 mr-1" />
                          RE-READ
                        </>
                    )}
                  </Badge>

                  <Badge variant="secondary" className="text-xs px-2.5 py-1 whitespace-nowrap">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {book.discussion_month} {book.discussion_year}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bookmark className="h-12 w-12" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Share2 className="h-12 w-12" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">
                {book.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-4 truncate">
                by <span className="font-medium">{book.author}</span>
              </p>

              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6">
                {book.short_desc}
              </p>

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

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
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
                      <div className="flex items-center gap-2">
                        {chapterSummaries.length > 0 && (
                          <Badge variant="blue">
                            {chapterSummaries.length} available
                          </Badge>
                        )}
                        {/* ─── ADD SUMMARY BUTTON (Admin only) ─── */}
                        {isAdmin && book.status === 'DISCUSSING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddSummary}
                            className="gap-1.5 px-3"
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      Download chapter summaries submitted by book club members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {summaryLoading ? (
                      <div className="flex items-center justify-center py-12 gap-3">

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

                                {isAdmin && (book.status === 'DISCUSSING' || book.status === 'RE_READ') && (
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
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteSummary(chapter)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete 
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

                {/* All Chapters */}
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
                              <div className="min-w-[32px] min-h-[32px] rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussion">
            <BookComments bookId={parseInt(bookId)} bookTitle={book.title} />
          </TabsContent>
        </Tabs>
      </main>

      {/* ════════════════════════════════════════════
          Edit Book Dialog
          ════════════════════════════════════════════ */}
      <Dialog open={editBookDialogOpen} onOpenChange={setEditBookDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
                    <Upload className="h-4 w-2" />
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

            <Separator />

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
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={bookForm.genre}
                  onChange={(e) => handleBookFormChange('genre', e.target.value)}
                  placeholder="Non-fiction"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={bookForm.status}
                  onValueChange={(value) => handleBookFormChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════
          Add / Edit Summary Dialog
          ════════════════════════════════════════════ */}
      <Dialog open={editSummaryDialogOpen} onOpenChange={setEditSummaryDialogOpen}>
        <DialogContent className="max-w-md mt-2 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-nowrap">
              {isAddingSummary ? "Add Chapter Summary" : "Edit Chapter Summary"}
            </DialogTitle>
            <DialogDescription className="text-nowrap">
              {isAddingSummary
                ? "Create a new chapter summary for this book"
                : selectedChapter && (
                  <>
                    Chapter {selectedChapter.chapter_number}:{" "}
                    {selectedChapter.chapter_title}
                  </>
                )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ─── Chapter Number & Title (only when adding) ─── */}

            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="chapter_number">Chapter No.</Label>
                  <Input
                    id="chapter_number"
                    type="number"
                    min="1"
                    value={summaryForm.chapter_number}
                    onChange={(e) =>
                      setSummaryForm((prev) => ({
                        ...prev,
                        chapter_number: e.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="chapter_title">Chapter Title</Label>
                  <Input
                    id="chapter_title"
                    value={summaryForm.chapter_title}
                    onChange={(e) =>
                      setSummaryForm((prev) => ({
                        ...prev,
                        chapter_title: e.target.value,
                      }))
                    }
                    placeholder="Chapter title"
                  />
                </div>
              </div>
              <Separator />
            </>


            {/* Current File Info (Edit mode only) */}
            {!isAddingSummary && selectedChapter?.summary_file && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center text-nowrap gap-1 text-sm">
                  <FileText className="h-4 w-2 text-primary" />
                  <span className="font-medium">Current File:</span>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {selectedChapter.summary_file.split('/').pop()}
                  </p>
                </div>
              </div>
            )}

            {/* Upload PDF */}
            <div className="space-y-2">
              <Label>
                {isAddingSummary ? "Upload Summary PDF *" : "Replace Summary PDF"}
              </Label>
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
                  <Upload className="h-4 w-1" />
                  {summaryFileName || "Choose PDF File"}
                </Button>
              </div>
              {summaryFileName && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {summaryFileName}
                </div>
              )}
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditSummaryDialogOpen(false)
                setSelectedChapter(null)
                setIsAddingSummary(false)
              }}
              disabled={editSummaryLoading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateSummary}
              disabled={
                editSummaryLoading ||
                (isAddingSummary && (!summaryFile || !summaryForm.chapter_number || !summaryForm.chapter_title?.trim()))
              }
              className="gap-2"
            >
              {editSummaryLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isAddingSummary ? "Add Summary" : "Update Summary"}
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