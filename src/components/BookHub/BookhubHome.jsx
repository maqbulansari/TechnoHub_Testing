import React, { useState } from 'react'
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
  Users,
  CheckCircle2,
  CalendarDays,
  Library,
  Sparkles
} from 'lucide-react'

const monthlySchedule = [
  {
    month: "January",
    year: 2024,
    books: [
      {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        short_desc: "Build good habits and break bad ones through small, incremental changes",
        cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        discussion_month: "January",
        discussion_year: 2024,
        is_discussed: true,
        has_summary: true
      }
    ],
    book_count: 1,
    is_current: false
  },
  {
    month: "February",
    year: 2024,
    books: [
      {
        id: 2,
        title: "The Alchemist",
        author: "Paulo Coelho",
        short_desc: "A magical story about following your dreams and listening to your heart",
        cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        discussion_month: "February",
        discussion_year: 2024,
        is_discussed: true,
        has_summary: true
      }
    ],
    book_count: 1,
    is_current: false
  },
  {
    month: "March",
    year: 2024,
    books: [
      {
        id: 3,
        title: "Deep Work",
        author: "Cal Newport",
        short_desc: "Rules for focused success in a distracted world",
        cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
        discussion_month: "March",
        discussion_year: 2024,
        is_discussed: false,
        has_summary: false
      }
    ],
    book_count: 1,
    is_current: true
  },
  {
    month: "April",
    year: 2024,
    books: [
      {
        id: 4,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        short_desc: "Timeless lessons on wealth, greed, and happiness",
        cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
        discussion_month: "April",
        discussion_year: 2024,
        is_discussed: false,
        has_summary: false
      }
    ],
    book_count: 1,
    is_current: false
  }
]

const upcomingBooks = [
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    short_desc: "Rules for focused success in a distracted world",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
    discussion_month: "March",
    discussion_year: 2024,
    is_discussed: false,
    has_summary: false
  },
  {
    id: 4,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    short_desc: "Timeless lessons on wealth, greed, and happiness",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
    discussion_month: "April",
    discussion_year: 2024,
    is_discussed: false,
    has_summary: false
  },
  {
    id: 5,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    short_desc: "Explore the two systems that drive the way we think",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
    discussion_month: "May",
    discussion_year: 2024,
    is_discussed: false,
    has_summary: false
  },
  {
    id: 6,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    short_desc: "Powerful lessons in personal change and effectiveness",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784i/36072.jpg",
    discussion_month: "June",
    discussion_year: 2024,
    is_discussed: false,
    has_summary: false
  }
]

const discussedBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    short_desc: "Build good habits and break bad ones through small, incremental changes",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    discussion_month: "January",
    discussion_year: 2024,
    is_discussed: true,
    has_summary: true
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    short_desc: "A magical story about following your dreams and listening to your heart",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    discussion_month: "February",
    discussion_year: 2024,
    is_discussed: true,
    has_summary: true
  },
  {
    id: 7,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    short_desc: "What the rich teach their kids about money that the poor and middle class do not",
    cover_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg",
    discussion_month: "December",
    discussion_year: 2023,
    is_discussed: true,
    has_summary: true
  }
]

const bookSummaries = {
  1: {
    id: 1,
    book: 1,
    book_title: "Atomic Habits",
    full_summary: "Atomic Habits by James Clear is a comprehensive guide to building good habits and breaking bad ones. The book emphasizes that small, incremental changes (1% improvements) compound over time to produce remarkable results. Clear introduces the Four Laws of Behavior Change: Make it Obvious, Make it Attractive, Make it Easy, and Make it Satisfying. He argues that focusing on systems rather than goals is more effective for long-term success. The book also explores identity-based habits, suggesting that the most effective way to change behavior is to focus on who you wish to become rather than what you want to achieve. Key concepts include habit stacking, environment design, and the two-minute rule for starting new habits.",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z"
  },
  2: {
    id: 2,
    book: 2,
    book_title: "The Alchemist",
    full_summary: "The Alchemist follows Santiago, a young Andalusian shepherd, on his journey to find a treasure near the Egyptian pyramids. Along the way, he learns about the importance of following one's Personal Legend and listening to one's heart. Paulo Coelho weaves themes of destiny, love, and the interconnectedness of all things. The book teaches that the journey itself is the treasure, and that when you truly want something, the universe conspires to help you achieve it. Santiago meets various characters including Melchizedek, the crystal merchant, and the alchemist himself, each teaching him valuable lessons about life and pursuing dreams.",
    created_at: "2024-02-15T10:30:00Z",
    updated_at: "2024-02-20T14:45:00Z"
  },
  7: {
    id: 3,
    book: 7,
    book_title: "Rich Dad Poor Dad",
    full_summary: "Rich Dad Poor Dad contrasts the financial philosophies of Robert Kiyosaki's two 'dads' - his biological father (Poor Dad) and his friend's father (Rich Dad). The book emphasizes financial literacy, investing in assets rather than liabilities, and building passive income streams. Key lessons include making money work for you, understanding the difference between assets and liabilities, and the importance of financial education. The book challenges conventional wisdom about money and encourages readers to think differently about wealth and financial independence.",
    created_at: "2023-12-15T10:30:00Z",
    updated_at: "2023-12-20T14:45:00Z"
  }
}

const currentBook = monthlySchedule.find(m => m.is_current)?.books[0]

export const BookhubHome = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBook, setSelectedBook] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-primary">
                BookHub
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Join Club
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        
        {currentBook && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Clock className="h-3 w-3 mr-1" />
                Currently Reading
              </Badge>
              <span className="text-sm text-muted-foreground">
                {monthlySchedule.find(m => m.is_current)?.month} {monthlySchedule.find(m => m.is_current)?.year}
              </span>
            </div>
            
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center">
                  <img 
                    src={currentBook.cover_image}
                    alt={currentBook.title}
                    className="w-48 h-72 object-cover rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
                
                <div className="flex-1 p-6 md:p-8">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {currentBook.title}
                      </h2>
                      <p className="text-lg text-muted-foreground mt-1">
                        by {currentBook.author}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                      {currentBook.short_desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {currentBook.discussion_month} {currentBook.discussion_year}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {currentBook.is_discussed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Discussed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 text-amber-500" />
                            In Progress
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="bg-primary hover:bg-primary/90 gap-2">
                        <BookOpen className="h-4 w-4" />
                        Start Reading
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Monthly Schedule
              </h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlySchedule.map((schedule) => (
              <Card 
                key={`${schedule.month}-${schedule.year}`}
                className={`transition-all hover:shadow-md ${
                  schedule.is_current 
                    ? 'border-primary border-2 bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {schedule.month}
                    </CardTitle>
                    {schedule.is_current && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{schedule.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  {schedule.books.map(book => (
                    <div key={book.id} className="flex gap-3">
                      <img 
                        src={book.cover_image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1">
                          {book.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.author}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {book.is_discussed && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                              Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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

            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4">
                      <img 
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-52 object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
                      />
                      <Badge className="absolute top-6 right-6 bg-white/90 text-gray-700 backdrop-blur-sm">
                        {book.discussion_month}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {book.short_desc}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full gap-2 text-primary hover:bg-primary/10">
                        <Calendar className="h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discussed">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {discussedBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-40 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
                        <img 
                          src={book.cover_image}
                          alt={book.title}
                          className="w-28 h-40 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">{book.title}</CardTitle>
                              <CardDescription>
                                by {book.author}
                              </CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Discussed
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {book.short_desc}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            {book.discussion_month} {book.discussion_year}
                            {book.has_summary && (
                              <>
                                <Separator orientation="vertical" className="h-3" />
                                <BookMarked className="h-3 w-3" />
                                Summary Available
                              </>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          {book.has_summary && bookSummaries[book.id] && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-2"
                                  onClick={() => setSelectedBook(book)}
                                >
                                  <BookOpen className="h-4 w-4" />
                                  Read Summary
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <div className="flex items-start gap-4">
                                    <img 
                                      src={book.cover_image}
                                      alt={book.title}
                                      className="w-20 h-28 object-cover rounded-lg shadow-md"
                                    />
                                    <div>
                                      <DialogTitle className="text-xl">{book.title}</DialogTitle>
                                      <DialogDescription className="mt-1">
                                        by {book.author}
                                      </DialogDescription>
                                      <div className="flex gap-2 mt-2">
                                        <Badge variant="outline">
                                          {book.discussion_month} {book.discussion_year}
                                        </Badge>
                                        <Badge className="bg-green-100 text-green-700">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Discussed
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <Separator className="my-4" />
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <BookMarked className="h-4 w-4 text-primary" />
                                      Book Summary
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                      {bookSummaries[book.id]?.full_summary}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Join Our Reading Community
            </h2>
            <p className="text-muted-foreground">
              Connect with fellow book lovers, participate in discussions, and expand your reading horizons
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <Library className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">
                {discussedBooks.length + upcomingBooks.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total Books</p>
            </Card>
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">
                {discussedBooks.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Books Discussed</p>
            </Card>
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">
                {upcomingBooks.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
            </Card>
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">
                150+
              </div>
              <p className="text-sm text-muted-foreground mt-1">Members</p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BookHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 BookHub. Building a community of readers. 📚
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BookhubHome