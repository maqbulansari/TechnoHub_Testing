import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";
import image1 from "../../assets/images/carousel/carousel8.jpg";
import image2 from "../../assets/images/carousel/carousel6.jpg";
import image3 from "../../assets/images/carousel/carousel7.jpg";
import image4 from "../../assets/images/carousel/carousel9.jpg";
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
  const images = [image1, image2, image3, image4];
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-[32px] sm:text-[42px] lg:text-[52px] leading-tight font-extrabold text-text">
              Unlock Your <br />
              Potential. <br />
              <span className="text-primary">Join Our Community.</span>
            </h1>

            <p className="mt-4 max-w-lg text-muted text-base sm:text-md">
              A collaborative space for learners, thinkers, and creators.
              Dive into cutting-edge technologies with expert trainers
              and a vibrant community.
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-xl overflow-hidden shadow-2xl shadow-black/40"
          >
            <img
              src={images[current]}
              alt="Hero Carousel"
              className="w-full h-[260px] sm:h-[320px] lg:h-[420px] object-cover transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

{/* Modal */}
      <Dialog open={openCenters} onOpenChange={setOpenCenters}>
        <DialogContent
          className="w-[95%] sm:max-w-lg max-h-[80vh] rounded-2xl p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 pt-10 pb-3 text-center border-b">
              <DialogTitle className="text-2xl font-bold">
                Our Training Centers
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Choose the nearest center and start learning with us.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              <div className="flex items-start gap-4 p-5 rounded-xl border hover:shadow-md transition">
                <MapPin className="text-primary mt-1" size={22} />
                <div>
                  <h3 className="font-semibold text-base">AllSaints</h3>
                  <p className="text-sm text-muted-foreground">
                    Airport Road, Bhopal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border hover:shadow-md transition">
                <MapPin className="text-primary mt-1" size={22} />
                <div>
                  <h3 className="font-semibold text-base">LGS</h3>
                  <p className="text-sm text-muted-foreground">
                    VIP Road, Bhopal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border hover:shadow-md transition">
                <MapPin className="text-primary mt-1" size={22} />
                <div>
                  <h3 className="font-semibold text-base">Mecaps</h3>
                  <p className="text-sm text-muted-foreground">
                    Near Moti Masjid, Bhopal
                  </p>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t flex justify-center">
              <Button
                className="px-10 rounded-full"
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
