import { motion } from 'motion/react';

interface SectionHeaderProps {
  label: string;
  title: string;
  titleAccent?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  label,
  title,
  titleAccent,
  description,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className={`flex items-center gap-4 mb-6 ${centered ? 'justify-center' : ''}`}
      >
        <div className="w-12 h-[2px] bg-gradient-to-r from-[#0200B5] to-[#0000F0]" />
        <span
          className={`text-xs font-sans font-bold tracking-[0.2em] uppercase ${
            light ? 'text-[#0200B5]' : 'text-[#6e8eff]'
          }`}
        >
          {label}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-4xl md:text-6xl lg:text-7xl font-sans font-black leading-[0.9] tracking-tight ${
          light ? 'text-[#0a0a1a]' : 'text-white'
        }`}
      >
        {title}
        {titleAccent && (
          <span className="bg-gradient-to-r from-[#0200B5] to-[#0000F0] bg-clip-text text-transparent">
            {titleAccent}
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-6 max-w-2xl font-sans text-lg md:text-xl font-light leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-[#0a0a1a]/70' : 'text-white/60'}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
