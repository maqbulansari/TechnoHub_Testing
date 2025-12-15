import { motion } from "framer-motion";

export const ThursdayReads = () => (
  <div className="max-w-6xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-lg shadow p-10 grid md:grid-cols-2 gap-12"
    >
      {/* Book Image */}
      <div className="bg-light rounded-lg p-4 sm:p-6">
        <motion.img
          src="https://m.media-amazon.com/images/I/7111-QqvNCL.jpg"
          alt="Amusing Ourselves to Death"
          className="max-h-[260px] sm:max-h-[320px] md:max-h-[620px] w-auto object-contain mx-auto"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
        />
      </div>


      {/* Content */}
      <div>
        <p className="text-primary font-semibold text-sm">
          Thursday Reads · Current Book
        </p>

        <h3 className="text-3xl font-bold mt-2 mb-4 text-dark">
          Amusing Ourselves to Death
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We are currently finishing <b>Part One</b> of Neil Postman’s
          thought-provoking book, which explores how modern media and
          entertainment shape public discourse and dilute serious thinking.
        </p>

        <h4 className="font-semibold mb-4 text-dark">
          Community Discussion (3)
        </h4>

        <div className="space-y-4">
          <div className="bg-light p-4 rounded-md text-sm">
            <b>Alina</b> — The contrast between print culture and television
            culture was eye-opening.
          </div>

          <div className="bg-light p-4 rounded-md text-sm">
            <b>Ben</b> — This explains so much about social media today.
          </div>

          <div className="bg-light p-4 rounded-md text-sm">
            <b>Rahul</b> — Curious to see how Part Two builds on this.
          </div>
        </div>

        <motion.a
          whileHover={{ x: 4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="inline-block mt-6 text-primary font-semibold cursor-pointer"
        >
          Join the discussion →
        </motion.a>
      </div>
    </motion.div>
  </div>
);
