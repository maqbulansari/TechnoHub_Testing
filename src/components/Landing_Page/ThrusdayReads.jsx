import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ThursdayReads = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl border border-gray-200 p-10"
      >
        {/* ===== Top Section : Readers' Hub ===== */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h4 className="text-2xl font-bold text-dark mb-3">
              Al Meezan Readers’ Hub
            </h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              An effort to cultivate intellectual balance. While engaging deeply
              with modern technology, we seek clarity, restraint, and
              <b> Baseera</b>—the vision to see beyond surface realities.
            </p>
          </div>

          <div>
            <div className="bg-light rounded-lg p-4 mb-3">
              <p
                dir="rtl"
                className="text-dark text-base leading-loose text-center"
              >
                مَثَلُ كَلِمَةٍ طَيِّبَةٍ كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ
                وَفَرْعُهَا فِي السَّمَاءِ
              </p>
            </div>

            <p className="text-gray-600 text-sm text-center">
              As we grow stronger in the worldly realm, we aspire to rise closer
              to our Creator.
            </p>
          </div>
        </div>

        {/* ===== Divider ===== */}
        <div className="my-14 mt-4 border-t border-gray-200" />

        {/* ===== Bottom Section : Book ===== */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Book Image (UNCHANGED) */}
          <div className="bg-light rounded-lg p-4 sm:p-6">
            <motion.img
              src="https://m.media-amazon.com/images/I/7111-QqvNCL.jpg"
              alt="Amusing Ourselves to Death"
              className="max-h-[180px] sm:max-h-[220px] md:max-h-[400px] w-auto object-contain mx-auto"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
            />

          </div>

          {/* Book Content */}
          <div>
            <p className="text-primary font-semibold text-sm">
              Al Meezan · Current Read
            </p>

            <h3 className="text-3xl font-bold mt-2 mb-4 text-dark">
              Amusing Ourselves to Death
            </h3>

            <p className="text-gray-600 leading-relaxed mb-4 text-md">
              We are finishing Part One of Neil Postman’s Amusing Ourselves to Death, which shows how modern media favors entertainment over serious public discourse. Postman’s son notes the book’s relevance today, especially for students immersed in screens and constant media. Many find it accurate in highlighting how news, politics, education, and religion are shaped by entertainment, shortening attention spans and discouraging deep thinking. Classroom activities like “media fasts” emphasize society’s dependence on technology, echoing Huxley’s warning that freedom can be lost through distraction and pleasure rather than force.
            </p>

            <button
              onClick={() => navigate("/Bookhub/Home")}
              className="text-primary font-semibold text-md hover:underline"
            >
              Join the discussion →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
