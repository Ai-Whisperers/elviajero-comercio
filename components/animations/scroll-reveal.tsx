"use client"
import { motion } from "framer-motion"
import { useRef } from "react"

export function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleOnHover({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className={className}>
      {children}
    </motion.div>
  )
}

export function PulseBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="inline-block"
    >
      {children}
    </motion.span>
  )
}
