import React, { useState } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  files?: string[]
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  files = ['index.js'],
}) => {
  const { settings } = useSettingsStore()
  const [activeFile, setActiveFile] = useState(files[0])

  return (
    <div className="editor-container">
      <div className="flex">
        {files.map((file) => (
          <div
            key={file}
            className={`code-tab ${activeFile === file ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveFile(file)}
          >
            {file}
          </div>
        ))}
      </div>
      <textarea
        aria-label="code-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 p-4 bg-gray-800 text-white font-mono"
        // style={{ fontSize: settings.fontSize }}
      />
    </div>
  )
}
