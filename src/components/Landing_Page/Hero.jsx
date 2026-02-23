import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import image1 from "../../assets/images/carousel/carousel8.jpg";
import image2 from "../../assets/images/carousel/carousel15.jpg";
import image3 from "../../assets/images/carousel/carousel7.jpg";
import image4 from "../../assets/images/carousel/carousel9.jpg";
import image5 from "../../assets/images/carousel/carousel17.jpeg";
import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import AnimatedButton from "../ui/AnimatedButton";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const images = [image5, image2, image1, image4, image3];
  const [current, setCurrent] = useState(0);
  const [openCenters, setOpenCenters] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <section className="bg-soft pt-28 sm:pt-32 pb-16 sm:pb-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl leading-tight font-extrabold text-text">
              A Community of <br className="hidden sm:block" />
              <span className="text-primary">Learners & Enablers</span>
            </h1>

            <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-muted text-sm sm:text-base leading-relaxed">
              Educationists, technologists, and industry leaders using
              technology to elevate and integrate Muslims globally.
              Building ethical and competent young Muslims who learn technology
              deeply and use it to uplift others.
            </p>

            <p className="mt-3 max-w-xl mx-auto lg:mx-0 py-4 rounded-lg text-sm italic text-muted-foreground leading-relaxed">
              أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ
              <br />
              <span className="not-italic text-xs block mt-2">
                "A good word is like a good tree — firmly rooted, reaching the skies."  —  Surah Ibrahim (14:24)
              </span> 
            </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <AnimatedButton
                onClick={() => navigate("/Courses")}
                className="px-7 py-3 bg-primary text-white rounded-full font-semibold"
              >
                Explore Courses
              </AnimatedButton>

              <AnimatedButton
                onClick={() => setOpenCenters(true)}
                className="px-7 border border-gray-200 py-3 bg-white rounded-full font-semibold"
              >
                Our Centers
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Right Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={images[current]}
              alt="Community Learning"
              className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover transition-all duration-700"
            />
          </motion.div>

        </div>
      </section>

      {/* Centers Modal */}
      <Dialog open={openCenters} onOpenChange={setOpenCenters}>
        <DialogContent
          className="
            w-[95%] sm:w-[85%] md:w-[65%] lg:w-[45%]
            max-h-[85vh]
            rounded-3xl
            p-0
            overflow-hidden
            flex flex-col
            bg-white
            [&>button]:hidden
          "
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 text-center border-b">
            <DialogTitle className="text-xl text-center sm:text-2xl font-bold">
              Our Training Centers
            </DialogTitle>
            <DialogDescription className="text-sm mt-2 max-w-sm mx-auto text-muted-foreground">
              Choose the nearest center and start learning with us.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-4">
              {[
                {
                  name: "AllSaints",
                  address: "Airport Road, Bhopal",
                  phone: "+91 98765 43210",
                },
                {
                  name: "LGS",
                  address: "VIP Road, Bhopal",
                  phone: "+91 98765 43211",
                },
                {
                  name: "Mecaps",
                  address: "Near Moti Masjid, Bhopal",
                  phone: "+91 98765 43212",
                },
              ].map((center, index) => (
                <div
                  key={index}
                  className="
                    flex flex-col sm:flex-row sm:items-center sm:justify-between
                    gap-3
                    px-4 py-4
                    rounded-xl
                    border border-gray-200
                    hover:shadow-md
                    transition-shadow
                    bg-white
                  "
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-1" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base text-text">
                        {center.name}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {center.address}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm sm:text-base text-muted-foreground sm:text-right">
                    {center.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/30">
            <Button
              className="w-full rounded-full py-2.5 text-base"
              onClick={() => setOpenCenters(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}