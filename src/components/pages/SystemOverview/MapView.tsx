import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface MapViewProps {}

export const MapView: React.FC<MapViewProps> = () => {
  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden border shadow-sm">
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-8 h-8 lg:w-24 lg:h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 lg:mb-8 border border-[#e5e7eb] shadow-sm">
            <MapPin className="w-4 h-4 lg:w-12 lg:h-12 text-[#6b7280]" />
          </div>
          <h3 className="text-white text-sm lg:text-2xl font-semibold mb-1 lg:mb-3">
            Map Integration
          </h3>
          <p className="text-[#6b7280] text-xs lg:text-lg mb-2 lg:mb-6">
            Nearmap integration coming soon
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium tracking-wider group"
          >
            Ready for satellite imagery
          </motion.button>
        </div>
      </div>
    </div>
  );
};
