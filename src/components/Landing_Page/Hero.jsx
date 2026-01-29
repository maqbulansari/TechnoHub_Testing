import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";
import image1 from "../../assets/images/carousel/carousel8.jpg";
import image2 from "../../assets/images/carousel/carousel6.jpg";
import image3 from "../../assets/images/carousel/carousel7.jpg";
import image4 from "../../assets/images/carousel/carousel9.jpg";
import image5 from "../../assets/images/carousel/carousel17.jpeg";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const navigate = useNavigate();
  const images = [image1, image2, image3, image4, image5];
  const [current, setCurrent] = useState(0);
  const [openCenters, setOpenCenters] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <section className="bg-soft pt-[120px] pb-[100px]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-[32px] sm:text-[42px] lg:text-[52px] font-extrabold text-text leading-snug">
              A Community of <br className="hidden sm:block" />
              <span className="text-primary">Learners & Enablers</span>
            </h1>


            <p className="mt-4 max-w-lg text-muted text-base sm:text-md leading-relaxed">
              Educationists, technologists, and industry leaders using
              technology to elevate and integrate Muslims globally.
            </p>

            <p className="mt-3 max-w-lg text-muted text-sm sm:text-base">
              Building ethical and competent young Muslims who learn technology
              deeply and use it to uplift others.
            </p>

            <p className="mt-4 max-w-lg text-sm italic text-muted-foreground">
              لَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًۭا كَلِمَةًۭ طَيِّبَةًۭ كَشَجَرَةٍۢ
              <br />
              <span className="not-italic text-xs">
                A good word is like a good tree — firmly rooted, reaching the skies.
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-xl overflow-hidden shadow-2xl shadow-black/40"
          >
            <img
              src={images[current]}
              alt="Community Learning"
              className="w-full h-[260px] sm:h-[320px] lg:h-[420px] object-cover transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Centers Modal */}
      <Dialog open={openCenters} onOpenChange={setOpenCenters}>
        <DialogContent
          className="
            w-[90%] 
            sm:w-[70%] 
            md:w-[50%] 
            lg:w-[35%] 
            max-h-[80vh] 
            rounded-2xl 
            p-4 
            overflow-hidden
          "
          backdropClassName="bg-transparent"
        >
          <div className="flex flex-col h-auto">

            {/* Header */}
            <DialogHeader className="px-4 pt-6 pb-2 text-center border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                Our Training Centers
              </DialogTitle>
              <DialogDescription className="text-sm mt-1 text-muted-foreground">
                Choose the nearest center and start learning with us.
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {[
                { name: "AllSaints", address: "Airport Road, Bhopal" },
                { name: "LGS", address: "VIP Road, Bhopal" },
                { name: "Mecaps", address: "Near Moti Masjid, Bhopal" },
              ].map((center, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {center.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {center.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t flex justify-center">
              <Button
                className="px-8 sm:px-10 rounded-full"
                onClick={() => setOpenCenters(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
