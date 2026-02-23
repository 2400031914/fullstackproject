import { useState, useRef } from 'react'

const PDF_ACCEPT = '.pdf'
const MAX_SIZE_MB = 5

export function FileUpload({ onFileSelect, accept = PDF_ACCEPT, maxSizeMB = MAX_SIZE_MB, error, disabled }) {
  const [drag, setDrag] = useState(false)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef(null)

  const validate = (file) => {
    if (!file) return null
    if (accept && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are allowed.'
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File must be under ${maxSizeMB}MB.`
    }
    return null
  }

  const handleFile = (file) => {
    setFileError('')
    const err = validate(file)
    if (err) {
      setFileError(err)
      onFileSelect?.(null)
      return
    }
    onFileSelect?.(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer?.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDrag(true)
  }

  const handleDragLeave = () => setDrag(false)

  const displayError = fileError || error

  return (
    <div className="space-y-1">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors ${
          drag ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mt-2 text-sm text-slate-600">
          Drop PDF here or <span className="font-medium text-indigo-600">browse</span>
        </p>
        <p className="text-xs text-slate-400">Max {maxSizeMB}MB</p>
      </div>
      {displayError && <p className="text-xs text-rose-600">{displayError}</p>}
    </div>
  )
}
