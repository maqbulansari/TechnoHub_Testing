import React, { useEffect, useState, useContext } from 'react'
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
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  BookMarked,
  CheckCircle2,
  CalendarDays,
  Eye,
  MessageCircle
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import { TECHNO_BASE_URL } from '@/environment'
import axios from 'axios'
import Loading from '@/Loading'

// Default placeholder image for books without covers
const DEFAULT_BOOK_COVER = "/placeholder-book.png"


const BookCard = ({ book, getBookCoverUrl, onClick, variant = "upcoming" }) => {
  const isDiscussed = variant === "discussed"

  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={getBookCoverUrl(book.cover_image)}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = DEFAULT_BOOK_COVER
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
          <Badge
            className={`text-white text-[10px] px-2 py-0.5 font-medium ${isDiscussed ? 'bg-green-500' : 'bg-amber-500'
              }`}
          >
            {isDiscussed && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
            {isDiscussed ? 'Discussed' : 'Upcoming'}
          </Badge>
          {/* <Badge className="bg-white/90 text-gray-700 text-[10px] px-2 py-0.5 font-medium">
            {book.discussion_month} {book.discussion_year}
          </Badge> */}
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
          {book.comment_count > 0 && (
            <Badge className="bg-blue-500/80 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm gap-1">
              <MessageCircle className="h-2.5 w-2.5" />
              {book.comment_count}
            </Badge>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="gap-2 shadow-lg">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-muted-foreground mb-2">
          by {book.author}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {book.short_desc}
        </p>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1.5 group-hover:bg-[#2196F3] group-hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {isDiscussed ? 'Read Summary' : 'View Book'}
        </Button>
      </div>
    </Card>
  )
}


const ScheduleCard = ({ schedule, getBookCoverUrl, onClick }) => {
  const book = schedule.books[0]

  return (
    <Card
      className={`relative overflow-hidden h-64 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer group ${schedule.is_current ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      onClick={onClick}
    >
      {/* Background Image */}
      {book && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${getBookCoverUrl(book.cover_image)})`
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
      {book?.is_discussed && !schedule.is_current &&(
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-green-500 text-white text-xs shadow-lg">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Done
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
        {book && (
          <div className="space-y-2">
            {/* Month & Year */}
            <div className="inline-flex text-nowrap items-center text-white/70 text-sm font-medium">
              <CalendarDays className="h-4 w-4 mr-1" />
              {schedule.month} {schedule.year}
            </div>
            {/* Book Title */}
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-white/80 text-sm">
              by {book.author}
            </p>

            {/* Chapters info */}
            {book.total_chapters && (
              <div className="inline-flex items-center text-nowrap text-white/60 text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {book.total_chapters} chapters
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}


const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground">
      {description}
    </p>
  </div>
)


export const BookhubHome = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("upcoming")
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { API_BASE_URL } = useContext(AuthContext)

  // Helper function to get auth headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
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

  // Navigate to book detail
  const navigateToBook = (bookId) => {
    navigate(`/bookhub/book/${bookId}`)
  }

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${TECHNO_BASE_URL}/bookhub/books/`
        )
        setBooks(response.data)

      } catch (err) {
        setError('Failed to load books. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [API_BASE_URL])
  // Get current month and year
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Month order for sorting
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Derive current book
  const currentBook = books.find(book =>
    book.discussion_month === currentMonth &&
    book.discussion_year === currentYear &&
    book.status === "DISCUSSING" || book.status === "RE_READ"
  ) || books.find(book => book.status === "DISCUSSING")


  // Filter upcoming books (not discussed)
  const upcomingBooks = books
    .filter(book =>
      book.status === "UPCOMING" 
    )
    .sort((a, b) => {
      if (a.discussion_year !== b.discussion_year)
        return a.discussion_year - b.discussion_year
      return monthOrder.indexOf(a.discussion_month) - monthOrder.indexOf(b.discussion_month)
    })

  // Filter discussed books
  const discussedBooks = books
    .filter(book => book.status === "DISCUSSED")
    .sort((a, b) => {
      if (b.discussion_year !== a.discussion_year)
        return b.discussion_year - a.discussion_year
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
    return <Loading />
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <EmptyState
          icon={BookOpen}
          title="No Books Available"
          description="No books available yet. Check back later!"
        />
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

            <Card
              className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigateToBook(currentBook.id)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Book Cover */}
                <div className="sm:w-44 md:w-52 bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-5 flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={getBookCoverUrl(currentBook.cover_image)}
                      alt={currentBook.title}
                      className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-md shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = DEFAULT_BOOK_COVER
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
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-primary transition-colors">
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
                      <Badge variant="primary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {currentBook.discussion_month} {currentBook.discussion_year}
                      </Badge>
                      {currentBook.total_chapters && (
                        <Badge variant="primary" className="text-xs text-nowrap px-2 py-0.5 gap-1">
                          <BookOpen className="h-3 w-3" />
                          {currentBook.total_chapters} Chapters
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs text-nowrap px-2 py-0.5 gap-1`}
                      >
                        {currentBook.status === "DISCUSSING" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            DISCUSSING
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Re-Read
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      size="sm"
                      className="gap-1.5 h-9 px-4 text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateToBook(currentBook.id)
                      }}
                    >
                      <BookOpen className="h-4 w-4" />
                      View Book
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-9 px-4 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
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
        {/* {monthlySchedule.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl text-nowrap font-bold text-gray-900 dark:text-gray-100">
                  Monthly Schedule
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {monthlySchedule.slice(0, 4).map((schedule) => (
                <ScheduleCard
                  key={`${schedule.month}-${schedule.year}`}
                  schedule={schedule}
                  getBookCoverUrl={getBookCoverUrl}
                  onClick={() => schedule.books[0] && navigateToBook(schedule.books[0].id)}
                />
              ))}
            </div>
          </section>
        )} */}

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
                <EmptyState
                  icon={Clock}
                  title="No Upcoming Books"
                  description="Check back later for new books."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {upcomingBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      getBookCoverUrl={getBookCoverUrl}
                      onClick={() => navigateToBook(book.id)}
                      variant="upcoming"
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Discussed Books Tab */}
            <TabsContent value="discussed">
              {discussedBooks.length === 0 ? (
                <EmptyState
                  icon={BookMarked}
                  title="No Discussed Books"
                  description="Discussed books will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {discussedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      getBookCoverUrl={getBookCoverUrl}
                      onClick={() => navigateToBook(book.id)}
                      variant="discussed"
                    />
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