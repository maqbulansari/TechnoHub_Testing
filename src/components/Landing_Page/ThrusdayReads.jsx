import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TECHNO_BASE_URL } from "@/environment";

const DEFAULT_BOOK_COVER = "/default-book-cover.jpg";

const getBookCoverUrl = (coverPath) => {
  if (!coverPath) return DEFAULT_BOOK_COVER;
  if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
    return coverPath;
  }
  return `${TECHNO_BASE_URL}${coverPath.startsWith("/") ? "" : "/"}${coverPath}`;
};

const StatusBadge = ({ status }) => {
  const styles = {
    DISCUSSING: "bg-green-100 text-green-700",
    DISCUSSED: "bg-blue-100 text-blue-700",
    UPCOMING: "bg-yellow-100 text-yellow-700",
  };

  const labels = {
    DISCUSSING: "Currently Discussing",
    DISCUSSED: "Discussed",
    UPCOMING: "Upcoming",
  };

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const BookCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg mb-3 aspect-[3/4]" />
    <div className="h-4 w-20 bg-gray-200 rounded-full mb-2" />
    <div className="h-3 w-full bg-gray-200 rounded mb-1" />
    <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-3 w-1/2 bg-gray-200 rounded mb-1" />
    <div className="h-3 w-1/3 bg-gray-200 rounded" />
  </div>
);

export const ThursdayReads = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${TECHNO_BASE_URL}/bookhub/books/`);
        setBooks(response.data);
      } catch (err) {
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8 lg:p-10"
      >
        {/* ===== Top Section: Readers' Hub ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Column - Description */}
          <div className="flex flex-col justify-start">
            <p className="text-gray-600 text-sm leading-relaxed text-left">
              Al Meezan Readers' Hub is an attempt to attain an intellectual
              balance! As we get our roots deep and firm through technology,
              which today is predominantly produced by the West, we don't want
              to play naive and import the liberal intellectual infrastructure
              too into the minds of our youth and hence we dream of a vibrant
              community of competent technocrats who are well versed not only in
              technology but also possess the ability, the vision{" "}
              <b>Baseera</b> to penetrate through the outward reality and see
              things for what they really are.
            </p>
          </div>

          {/* Right Column - Arabic Verse */}
          <div className="flex flex-col justify-start">
            <div className="bg-light rounded-lg p-4 sm:p-5">
              <p
                dir="rtl"
                className="text-dark text-base leading-loose text-center"
              >
                أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً
                كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِي
                السَّمَاءِ
              </p>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm text-center mt-2 sm:mt-3">
              As we go deeper and stronger in the <b>worldly</b>, we want to go
              higher and closer to our Creator
            </p>
          </div>
        </div>

        {/* ===== Divider ===== */}
        <div className="my-6 sm:my-8 border-t border-gray-200" />

        {/* ===== Books Section Header ===== */}
        <div className="flex items-end justify-between mb-5 sm:mb-6 md:mb-8 gap-4">
          <div className="min-w-0">
            <p className="text-primary font-semibold text-xs sm:text-sm">
              Al Meezan · Reading List
            </p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-dark mt-1">
              Our Book Journey
            </h3>
          </div>
          {!loading && books.length > 0 && (
            <button
              onClick={() => navigate("/Bookhub/Home")}
              className="text-primary font-semibold text-xs sm:text-sm hover:underline hidden sm:block whitespace-nowrap flex-shrink-0"
            >
              View All →
            </button>
          )}
        </div>

        {/* ===== Skeleton Loading State ===== */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ===== Error State ===== */}
        {!loading && error && (
          <div className="text-center py-10 sm:py-16">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-primary text-sm font-semibold hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===== Empty State ===== */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-10 sm:py-16">
            <p className="text-gray-500 text-sm">No books available yet.</p>
          </div>
        )}

        {/* ===== Books Grid ===== */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => navigate("/Bookhub/Home")}
                className="group cursor-pointer"
              >
                {/* Book Cover */}
                <div className="bg-light rounded-lg overflow-hidden mb-2 sm:mb-3 aspect-[3/4]">
                  <img
                    src={getBookCoverUrl(book.cover_image)}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = DEFAULT_BOOK_COVER;
                    }}
                  />
                </div>

                {/* Book Info */}
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="text-dark font-semibold text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {book.title}
                  </h4>

                  <p className="text-gray-500 text-[11px] sm:text-xs italic line-clamp-1">
                    {book.author}
                  </p>

                  <p className="text-gray-400 text-[11px] sm:text-xs">
                    {book.discussion_month} {book.discussion_year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== Mobile View All Button ===== */}
        {!loading && !error && books.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center sm:hidden">
            <button
              onClick={() => navigate("/Bookhub/Home")}
              className="text-primary font-semibold text-sm hover:underline"
            >
              View All Books →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};