import React from 'react';
import { motion } from 'motion/react';

interface BookLoaderProps {
  size?: 'small' | 'large';
  text?: string;
}

export const BookLoader: React.FC<BookLoaderProps> = ({ size = 'large', text }) => {
  const isLarge = size === 'large';

  // Letter pulse configurations for EMS
  const letterVariants = {
    hidden: { opacity: 0.15, y: 6, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      }
    })
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 ${isLarge ? 'min-h-[200px]' : 'py-3'}`}>
      {/* Creative EMS Enterprise Core Network Node Structure */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer Orbit Dashed Circle representing connected modules */}
        <motion.div
          className={`absolute rounded-full border border-dashed border-sky-500/20 ${isLarge ? 'w-24 h-24' : 'w-12 h-12'}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Solid Tech ring */}
        <motion.div
          className={`absolute rounded-full border border-sky-400/40 ${isLarge ? 'w-16 h-16' : 'w-8 h-8'}`}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Branded EMS Typography Node */}
        <div className={`relative flex items-center justify-center gap-1 font-black tracking-widest text-white ${isLarge ? 'text-2xl' : 'text-xs'}`}>
          {['E', 'M', 'S'].map((letter, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] font-mono font-extrabold"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Floating process core orbits */}
        <motion.div
          className={`absolute bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)] ${isLarge ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}`}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
            y: [-12, 12, -12],
            x: [12, -12, 12],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: isLarge ? '-10px' : '-5px', left: isLarge ? '22px' : '11px' }}
        />

        <motion.div
          className={`absolute bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)] ${isLarge ? 'w-2 h-2' : 'w-1.2 h-1.2'}`}
          animate={{
            scale: [1.3, 0.8, 1.3],
            opacity: [0.6, 1, 0.6],
            y: [12, -12, 12],
            x: [-12, 12, -12],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          style={{ bottom: isLarge ? '-6px' : '-3px', right: isLarge ? '18px' : '9px' }}
        />
      </div>

      {/* Cybernetic dynamic progress slider line */}
      {isLarge && (
        <div className="w-44 h-0.5 bg-slate-800 rounded-full overflow-hidden mb-4 relative border border-slate-700/30">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.5)]"
            animate={{
              left: ["-45%", "105%"],
              width: ["40%", "15%", "40%"]
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      {/* Informative loading descriptions */}
      {text ? (
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase text-center max-w-xs px-4 animate-pulse">
          {text}
        </p>
      ) : (
        isLarge && (
          <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase text-center animate-pulse">
            Enterprise Module Initializing
          </p>
        )
      )}
    </div>
  );
};

