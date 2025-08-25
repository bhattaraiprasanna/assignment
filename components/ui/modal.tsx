"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: "small" | "medium" | "large"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  children: React.ReactNode
  className?: string
}

const sizeClasses = {
  small: "max-w-md",
  medium: "max-w-lg",
  large: "max-w-2xl",
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const firstFocusableElement = useRef<HTMLElement | null>(null)
  const lastFocusableElement = useRef<HTMLElement | null>(null)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Lock body scroll
      document.body.style.overflow = "hidden"

      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )

          if (focusableElements.length > 0) {
            firstFocusableElement.current = focusableElements[0] as HTMLElement
            lastFocusableElement.current = focusableElements[focusableElements.length - 1] as HTMLElement
            firstFocusableElement.current?.focus()
          } else {
            modalRef.current.focus()
          }
        }
      }, 100)
    } else {
      // Unlock body scroll
      document.body.style.overflow = ""

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      // Handle Escape key
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault()
        onClose()
        return
      }

      // Handle Tab key for focus trapping
      if (event.key === "Tab") {
        if (!firstFocusableElement.current || !lastFocusableElement.current) return

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement.current) {
            event.preventDefault()
            lastFocusableElement.current.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement.current) {
            event.preventDefault()
            firstFocusableElement.current.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeOnEscape, onClose])

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? "animate-in fade-in-0" : "animate-out fade-out-0"
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-popover border border-border rounded-lg shadow-lg ${
          isOpen ? "animate-in zoom-in-95 slide-in-from-bottom-2" : "animate-out zoom-out-95 slide-out-to-bottom-2"
        } ${className}`}
        tabIndex={-1}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="modal-title" className="text-lg font-semibold text-popover-foreground">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className={`${title ? "p-6" : "p-6"} text-popover-foreground`}>{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Convenience components for common modal patterns
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="space-y-4">
        <p className="text-popover-foreground">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
