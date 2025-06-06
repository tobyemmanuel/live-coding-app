import React from 'react'
import { motion } from 'framer-motion'

export const LoadingSpinner: React.FC = () => {
  return (
    <motion.div
      className="inline-block h-8 w-8 border-4 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}
