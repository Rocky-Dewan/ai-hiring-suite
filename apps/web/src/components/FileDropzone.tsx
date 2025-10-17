import React, { useCallback, useRef, useState } from 'react'

type Props = {
  onFile: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
}

export default function FileDropzone({ onFile, accept, maxSizeMB = 20 }: Props) {
  const [hover, setHover] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const pick = () => inputRef.current?.click()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null)
      if (!files || files.length === 0) {
        onFile(null)
        return
      }
      const f = files[0]
      const okBySize = f.size <= maxSizeMB * 1024 * 1024
      if (!okBySize) {
        setError(`File too large. Max ${maxSizeMB} MB.`)
        onFile(null)
        return
      }
      onFile(f)
    },
    [maxSizeMB, onFile]
  )

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        setHover(true)
      }}
      onDragLeave={() => setHover(false)}
      onDrop={e => {
        e.preventDefault()
        setHover(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`border-2 border-dashed rounded p-6 cursor-pointer transition ${hover ? 'border-black bg-gray-50' : 'border-gray-300'
        }`}
      onClick={pick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && pick()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={e => handleFiles(e.target.files)}
      />
      <div className="text-center">
        <div className="font-medium">Drop your resume here</div>
        <div className="text-sm text-gray-600">PDF, DOCX, or TXT preferred</div>
        <div className="text-xs text-gray-500 mt-2">Click to browse</div>
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  )
}
