"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-width background image collage */}
      <div className="absolute inset-0">
        <div className="grid grid-cols-3 h-full">
          {/* Left Image */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>

          {/* Center Image */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          ></motion.div>

          {/* Right Image */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>

        {/* Dark overlay for text readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-green-600/20 border border-green-400/30 rounded-full text-green-300 text-sm mb-6 backdrop-blur-sm">
              2026 Hybrid & Hyperlocal Marketplace
            </span>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto">
              Instant Local Delivery or National Shipping—Your Choice
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Get products in 15–40 minutes from neighborhood sellers within 1–5
              km, or choose 1–3 day shipping from national brands and
              warehouses. One unified platform, ultimate flexibility.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/products")}
                className="px-8 py-4 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/vendors")}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105"
              >
                Explore Local Sellers
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
