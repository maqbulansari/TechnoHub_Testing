import React, { useEffect, useState, useContext } from 'react'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  BookMarked,
  CheckCircle2,
  CalendarDays,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import axios from 'axios'
import Loading from '@/Loading'

// Default placeholder image for books without covers
const DEFAULT_BOOK_COVER = "/placeholder-book.png" // or use a URL to a default image

export const BookhubHome = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBook, setSelectedBook] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookSummaries, setBookSummaries] = useState({})
  const [loadingSummary, setLoadingSummary] = useState(false)

  const { API_BASE_URL } = useContext(AuthContext)

  // Helper function to get proper image URL
  const getBookCoverUrl = (coverPath) => {
    if (!coverPath) return DEFAULT_BOOK_COVER;

    // Replace localhost:8000 or localhost:7000 with API_BASE_URL
    if (coverPath.startsWith("http://localhost:8000")) {
      return coverPath.replace("http://localhost:8000", API_BASE_URL);
    }

    if (coverPath.startsWith("http://localhost:7000")) {
      return coverPath.replace("http://localhost:7000", API_BASE_URL);
    }

    // If it's already a full URL (external), return as is
    if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
      return coverPath;
    }

    // If it's a relative path, prepend API_BASE_URL
    return `${API_BASE_URL}${coverPath.startsWith('/') ? '' : '/'}${coverPath}`;
  };

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${API_BASE_URL}/bookhub/books/`)
        const re = await axios.get(`${API_BASE_URL}/bookhub/summaries/?book=${2}`)
        console.log(re);
        
        setBooks(response.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load books. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [API_BASE_URL])

  // Fetch summary for a specific book
  const fetchBookSummary = async (bookId) => {
    if (bookSummaries[bookId]) return // Already fetched

    try {
      setLoadingSummary(true)
      const response = await axios.get(`${API_BASE_URL}/bookhub/books/summary/${bookId}/   `)
      setBookSummaries(prev => ({
        ...prev,
        [bookId]: response.data
      }))
      
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    } finally {
      setLoadingSummary(false)
    }
  }

  // Get current month and year
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Month order for sorting
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Derive current book (current month's book or first upcoming)
  const currentBook = books.find(book =>
    book.discussion_month === currentMonth &&
    book.discussion_year === currentYear &&
    !book.is_discussed
  ) || books.find(book => !book.is_discussed)

  // Filter upcoming books (not discussed)
  const upcomingBooks = books
    .filter(book => !book.is_discussed)
    .sort((a, b) => {
      if (a.discussion_year !== b.discussion_year) return a.discussion_year - b.discussion_year
      return monthOrder.indexOf(a.discussion_month) - monthOrder.indexOf(b.discussion_month)
    })

  // Filter discussed books
  const discussedBooks = books
    .filter(book => book.is_discussed)
    .sort((a, b) => {
      if (b.discussion_year !== a.discussion_year) return b.discussion_year - a.discussion_year
      return monthOrder.indexOf(b.discussion_month) - monthOrder.indexOf(a.discussion_month)
    })

  // Generate monthly schedule from books
  const monthlySchedule = books.reduce((acc, book) => {
    const existing = acc.find(
      s => s.month === book.discussion_month && s.year === book.discussion_year
    )

    if (existing) {
      existing.books.push(book)
      existing.book_count++
    } else {
      const isCurrent = currentBook &&
        book.discussion_month === currentBook.discussion_month &&
        book.discussion_year === currentBook.discussion_year

      acc.push({
        month: book.discussion_month,
        year: book.discussion_year,
        books: [book],
        book_count: 1,
        is_current: isCurrent
      })
    }

    return acc
  }, []).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  })

  // Loading state
  if (loading) {
    return (
      <Loading />
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No books available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="container mx-auto px-4 py-8 space-y-10">

        {/* Current Book Section */}
        {currentBook && (
          <section>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary text-nowrap text-primary-foreground text-xs px-2.5 py-1">
                <Clock className="h-3 w-3 mr-1.5" />
                Currently Reading
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentBook.discussion_month} {currentBook.discussion_year}
              </span>
            </div>

            <Card className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {/* Book Cover */}
                <div className="sm:w-44 md:w-52 bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-5 flex items-center justify-center">
                  <div className="relative group">
                    <img
                      src={getBookCoverUrl(currentBook.cover_image)}
                      alt={currentBook.title}
                      className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-md shadow-lg group-hover:shadow-xl transition-all duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_BOOK_COVER;
                      }}
                    />
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Title & Author */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {currentBook.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {currentBook.author}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {currentBook.short_desc}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {currentBook.discussion_month} {currentBook.discussion_year}
                      </Badge>
                      {currentBook.total_chapters && (
                        <Badge variant="secondary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                          <BookOpen className="h-3 w-3" />
                          {currentBook.total_chapters} Chapters
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-xs text-nowrap px-2 py-0.5 gap-1 ${currentBook.is_discussed
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                      >
                        {currentBook.is_discussed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Discussed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            In Progress
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    <Button size="sm" className="gap-1.5 h-9 px-4 text-sm">
                      <BookOpen className="h-4 w-4" />
                      Start Reading
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 h-9 px-4 text-sm">
                      <Calendar className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Monthly Schedule Section */}
        {monthlySchedule.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl px-4 text-nowrap  font-bold text-gray-900 dark:text-gray-100">
                  Monthly Schedule
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {monthlySchedule.slice(0, 4).map((schedule) => (
                <Card
                  key={`${schedule.month}-${schedule.year}`}
                  className={`relative overflow-hidden h-64 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer group ${schedule.is_current
                    ? 'ring-2 ring-primary ring-offset-2'
                    : ''
                    }`}
                >
                  {/* Background Image */}
                  {schedule.books[0] && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getBookCoverUrl(schedule.books[0].cover_image)})`
                      }}
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                  {/* Current Badge */}
                  {schedule.is_current && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-primary text-primary-foreground text-xs shadow-lg">
                        <Clock className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    </div>
                  )}

                  {/* Discussed Badge */}
                  {schedule.books[0]?.is_discussed && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-green-500 text-white text-xs shadow-lg">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Done
                      </Badge>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                    {schedule.books.map(book => (
                      <div key={book.id} className="space-y-2">
                        {/* Month & Year */}
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-white/70" />
                          <span className="text-white/70 text-sm font-medium">
                            {schedule.month} {schedule.year}
                          </span>
                        </div>

                        {/* Book Title */}
                        <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-white/80 text-sm">
                          by {book.author}
                        </p>

                        {/* Chapters info if available */}
                        {book.total_chapters && (
                          <div className="flex items-center gap-1 text-white/60 text-xs">
                            <BookOpen className="h-3 w-3" />
                            {book.total_chapters} chapters
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Tabs Section */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="upcoming" className="gap-2">
                <Clock className="h-4 w-4" />
                Upcoming ({upcomingBooks.length})
              </TabsTrigger>
              <TabsTrigger value="discussed" className="gap-2">
                <BookMarked className="h-4 w-4" />
                Discussed ({discussedBooks.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Books Tab */}
            <TabsContent value="upcoming">
              {upcomingBooks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    No Upcoming Books
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new books.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {upcomingBooks.map((book) => (
                    <Card
                      key={book.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image Container - Reduced Height */}
                      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={getBookCoverUrl(book.cover_image)}
                          alt={book.title}
                          className="max-h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_BOOK_COVER;
                          }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                          <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0.5 font-medium">
                            Upcoming
                          </Badge>
                          <Badge className="bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 font-medium">
                            {book.discussion_month}
                          </Badge>
                        </div>

                        {/* Chapters Badge */}
                        {book.total_chapters && (
                          <div className="absolute bottom-2.5 left-2.5">
                            <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">
                              {book.total_chapters} chapters
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content - Better Spacing */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-1 mb-0.5">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-xs text-muted-foreground mb-2">
                          {book.author}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                          {book.short_desc}
                        </p>

                        {/* Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs gap-1.5"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Add to Calendar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Discussed Books Tab */}
            <TabsContent value="discussed">
              {discussedBooks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <BookMarked className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    No Discussed Books
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Discussed books will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {discussedBooks.map((book) => (
                    <Card
                      key={book.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image Container - Reduced Height */}
                      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={getBookCoverUrl(book.cover_image)}
                          alt={book.title}
                           className="max-h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_BOOK_COVER;
                          }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                          <Badge className="bg-green-500 text-white text-[10px] px-2 py-0.5 font-medium">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                            Discussed
                          </Badge>
                          <Badge className="bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 font-medium">
                            {book.discussion_month}
                          </Badge>
                        </div>

                        {/* Bottom Badges */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-1.5">
                          {book.total_chapters && (
                            <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">
                              {book.total_chapters} chapters
                            </Badge>
                          )}
                          {book.has_summary && (
                            <Badge className="bg-primary/80 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">
                              Summary
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Content - Better Spacing */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-1 mb-0.5">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-xs text-muted-foreground mb-2">
                          {book.author}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                          {book.short_desc}
                        </p>

                        {/* Button */}
                        {book.has_summary ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-8 text-xs gap-1.5 hover:bg-primary hover:text-white"
                                onClick={() => {
                                  setSelectedBook(book)
                                  fetchBookSummary(book.id)
                                }}
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                Read Summary
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col p-0">
                              {/* Dialog Header with Image */}
                              <div className="relative h-32 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                <img
                                  src={getBookCoverUrl(book.cover_image)}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = DEFAULT_BOOK_COVER;
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Content on Image */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <div className="flex gap-2 mb-2">
                                    <Badge className="bg-green-500 text-white text-[10px]">
                                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                      Discussed
                                    </Badge>
                                    <Badge className="bg-white/20 text-white text-[10px] backdrop-blur-sm">
                                      {book.discussion_month} {book.discussion_year}
                                    </Badge>
                                  </div>
                                  <h2 className="text-white font-bold text-lg leading-tight line-clamp-1">
                                    {book.title}
                                  </h2>
                                  <p className="text-white/80 text-sm">
                                    by {book.author}
                                  </p>
                                </div>
                              </div>

                              {/* Summary Content */}
                              <div className="flex-1 overflow-y-auto p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <BookMarked className="h-4 w-4 text-primary" />
                                  <h4 className="font-semibold text-sm">Book Summary</h4>
                                </div>

                                {loadingSummary ? (
                                  <div className="flex items-center justify-center py-8 gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">Loading...</span>
                                  </div>
                                ) : bookSummaries[book.id] ? (
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {bookSummaries[book.id].full_summary}
                                  </p>
                                ) : (
                                  <div className="text-center py-8">
                                    <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      Summary not available.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs gap-1.5 opacity-50"
                            disabled
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            No Summary
                          </Button>
                        )}
                      </div>
                    </Card>
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