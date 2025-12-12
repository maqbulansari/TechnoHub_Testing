import React, { useContext } from "react";
// import { SponsorContext } from "../../../contexts/dashboard/sponsorDashboardContext";
import { motion } from "framer-motion";
import { SponsorContext } from "@/contexts/dashboard/sponsorDashboardContext";

/**
 * Centers: horizontal card list, animated, uses sponsor context batchSummary.
 * Each card matches the video: title, two blue stat chips with icons.
 */
export const Centers = () => {
  const { batchSummary = [] } = useContext(SponsorContext) || {};

  // Fallback demo data if none present (static, safe)
  const fallback = [
    { center: "AllSaints", total_batches: 5, total_students: 45 },
    { center: "LGS", total_batches: 3, total_students: 28 },
    { center: "Mecaps", total_batches: 6, total_students: 62 },
  ];
  const data = (batchSummary && batchSummary.length) ? batchSummary : fallback;

  return (
    <div className="w-full overflow-x-auto py-6 scrollbar-x">
      <div className="flex gap-6 px-4 md:px-6">
        {data.map((c) => (
          <motion.div key={c.center} initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.45 }} className="min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 text-center capitalize">{c.center}</h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm">Batches</div>
                    <div className="text-2xl font-bold">{c.total_batches}</div>
                  </div>
                  <div className="text-2xl opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-4a3 3 0 10-6 0 3 3 0 006 0z"/></svg>
                  </div>
                </div>

                <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm">Students</div>
                    <div className="text-2xl font-bold">{c.total_students}</div>
                  </div>
                  <div className="text-2xl opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};