'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning'
}: ConfirmationDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default for safety
      cancelButtonRef.current?.focus()
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onCancel()
          break
        case 'Tab':
          // Trap focus within dialog
          const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean)
          const currentIndex = focusableElements.indexOf(document.activeElement as HTMLButtonElement)
          
          if (event.shiftKey) {
            // Shift+Tab - go backwards
            event.preventDefault()
            const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
            focusableElements[prevIndex]?.focus()
          } else {
            // Tab - go forwards
            event.preventDefault()
            const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
            focusableElements[nextIndex]?.focus()
          }
          break
        case 'Enter':
          // Enter on focused button
          if (document.activeElement === confirmButtonRef.current) {
            event.preventDefault()
            onConfirm()
          } else if (document.activeElement === cancelButtonRef.current) {
            event.preventDefault()
            onCancel()
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onConfirm, onCancel])

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
          icon: '⚠️',
          iconColor: 'text-red-400'
        }
      case 'warning':
        return {
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
          icon: '⚠️',
          iconColor: 'text-yellow-400'
        }
      case 'info':
        return {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
          icon: 'ℹ️',
          iconColor: 'text-blue-400'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-sm w-full shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-2xl ${styles.iconColor}`} aria-hidden="true">
                {styles.icon}
              </span>
              <h2 
                id="dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            </div>

            {/* Message */}
            <p 
              id="dialog-description"
              className="text-gray-700 mb-6 leading-relaxed"
            >
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                ref={cancelButtonRef}
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label={`${cancelText} and close dialog`}
              >
                {cancelText}
              </button>
              <button
                ref={confirmButtonRef}
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
                aria-label={`${confirmText} action`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}