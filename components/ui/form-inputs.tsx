"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Search, Upload, X, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Common props interface for all form inputs
export interface BaseInputProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  className?: string
}

// TextInput Component
export interface TextInputProps extends BaseInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  maxLength?: number
  minLength?: number
  pattern?: string
  autoComplete?: string
}

export function TextInput({
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  value = "",
  onChange,
  placeholder,
  type = "text",
  maxLength,
  minLength,
  pattern,
  autoComplete,
  className = "",
}: TextInputProps) {
  const inputId = useRef(`text-input-${Math.random().toString(36).substr(2, 9)}`)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId.current} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId.current}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            error ? "border-destructive focus:border-destructive" : isFocused ? "border-ring" : "border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId.current}-error` : helperText ? `${inputId.current}-help` : undefined}
        />
      </div>
      {error && (
        <p id={`${inputId.current}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId.current}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}

// SelectInput Component with search functionality
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectInputProps extends BaseInputProps {
  value?: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
}

export function SelectInput({
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  value = "",
  onChange,
  options,
  placeholder = "Select an option",
  searchable = true,
  clearable = false,
  className = "",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const selectId = useRef(`select-input-${Math.random().toString(36).substr(2, 9)}`)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleClear = () => {
    onChange("")
    setSearchTerm("")
  }

  return (
    <div className={`space-y-2 relative ${className}`}>
      {label && (
        <label htmlFor={selectId.current} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          id={selectId.current}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-input text-foreground text-left focus:outline-none focus:ring-2 focus:ring-ring transition-colors flex items-center justify-between ${
            error ? "border-destructive focus:border-destructive" : "border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId.current}-error` : helperText ? `${selectId.current}-help` : undefined}
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center space-x-1">
            {clearable && selectedOption && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="p-1 hover:bg-muted rounded"
                aria-label="Clear selection"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}
            <div role="listbox" aria-labelledby={selectId.current}>
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-muted-foreground text-sm">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                      value === option.value ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                    } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p id={`${selectId.current}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId.current}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}

// FileUpload Component with drag & drop
export interface FileUploadProps extends BaseInputProps {
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
}

export function FileUpload({
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  onChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 1,
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadId = useRef(`file-upload-${Math.random().toString(36).substr(2, 9)}`)

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${(maxSize / 1024 / 1024).toFixed(1)}MB)`)
        continue
      }
      valid.push(file)
    }

    if (maxFiles && valid.length > maxFiles) {
      errors.push(`Too many files selected (max ${maxFiles})`)
      return { valid: valid.slice(0, maxFiles), errors }
    }

    return { valid, errors }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const { valid, errors } = validateFiles(fileArray)

    if (errors.length > 0) {
      console.warn("File validation errors:", errors)
    }

    setUploadedFiles(valid)
    onChange(valid)
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (!disabled) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [disabled],
  )

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? "border-ring bg-muted/50" : error ? "border-destructive" : "border-border"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id={uploadId.current}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
          aria-describedby={error ? `${uploadId.current}-error` : helperText ? `${uploadId.current}-help` : undefined}
        />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-foreground font-medium">
          {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && ` • Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
          {multiple && maxFiles > 1 && ` • Max files: ${maxFiles}`}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2 h-8 w-8 p-0"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p id={`${uploadId.current}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${uploadId.current}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}

// DatePicker Component
export interface DatePickerProps extends BaseInputProps {
  value?: string // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void
  placeholder?: string
  minDate?: string
  maxDate?: string
  format?: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY"
}

export function DatePicker({
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  value = "",
  onChange,
  placeholder = "Select a date",
  minDate,
  maxDate,
  format = "YYYY-MM-DD",
  className = "",
}: DatePickerProps) {
  const dateId = useRef(`date-picker-${Math.random().toString(36).substr(2, 9)}`)
  const [isFocused, setIsFocused] = useState(false)

  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)

    switch (format) {
      case "MM/DD/YYYY":
        return date.toLocaleDateString("en-US")
      case "DD/MM/YYYY":
        return date.toLocaleDateString("en-GB")
      default:
        return isoDate
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={dateId.current} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={dateId.current}
          type="date"
          value={value}
          onChange={handleDateChange}
          disabled={disabled}
          required={required}
          min={minDate}
          max={maxDate}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            error ? "border-destructive focus:border-destructive" : isFocused ? "border-ring" : "border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${dateId.current}-error` : helperText ? `${dateId.current}-help` : undefined}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {error && (
        <p id={`${dateId.current}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${dateId.current}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
