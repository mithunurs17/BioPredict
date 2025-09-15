import { motion } from "framer-motion";

export function HanumanGada() {
  return (
    <div className="absolute top-4 right-4 flex flex-col items-center">
      <motion.div
        initial={{ rotate: -45, scale: 0.8 }}
        animate={{ 
          rotate: [0, 15, 0, -15, 0],
          scale: [0.8, 1, 0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 relative"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gada head */}
          <motion.path
            d="M50 10 L60 30 L70 40 L60 50 L40 50 L30 40 L40 30 Z"
            fill="#FFD700"
            stroke="#B8860B"
            strokeWidth="2"
          />
          {/* Gada handle */}
          <motion.rect
            x="45"
            y="50"
            width="10"
            height="40"
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-white text-lg font-semibold mt-2 drop-shadow-lg"
      >
        "Always he protects us"
      </motion.p>
    </div>
  );
} 