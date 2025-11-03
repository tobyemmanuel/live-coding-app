import React, { useState, useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useSettingsStore } from '../../stores/settingsStore'
import {
  Play,
  Square,
  Terminal,
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  files?: string[]
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  files = ['index.js', 'styles.css', 'utils.js', 'package.json'],
}) => {
  const { settings } = useSettingsStore()
  const [activeFile, setActiveFile] = useState(files[0])
  const [isRunning, setIsRunning] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src'])
  )
  const [isTerminalVisible, setIsTerminalVisible] = useState(true)
  const editorRef = useRef<any>(null)
  const language = 'javascript'

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    editor.focus()

    // Add anti-cheat: Disable copy-paste from external sources
    editor.onKeyDown((e: any) => {
      // Allow internal copy-paste (Ctrl+C, Ctrl+X, Ctrl+V with selection)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)
      ) {
        if (e.keyCode === 86 && !editor.getSelection().isEmpty()) {
          // Only allow paste when there's a selection (replacing text)
          e.preventDefault()
        }
      }
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  // Simulate file structure
  const fileStructure = {
    src: {
      'index.js': 'file',
      'styles.css': 'file',
      'utils.js': 'file',
      components: {
        'Header.js': 'file',
        'Footer.js': 'file',
      },
    },
    'package.json': 'file',
    'README.md': 'file',
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setTerminalOutput('Running code...\n')
    setIsTerminalVisible(true)

    // Simulate code execution
    setTimeout(() => {
      setTerminalOutput(
        (prev) =>
          prev +
          `✓ Code executed successfully!\n$ Output: Hello World\n$ Process completed with exit code 0\n`
      )
      setIsRunning(false)
    }, 2000)
  }

  const handleStopCode = () => {
    setIsRunning(false)
    setTerminalOutput((prev) => prev + '⚠ Process terminated by user.\n')
  }

  const renderFileTree = (structure: any, path = '', level = 0) => {
    return Object.entries(structure).map(([name, type]) => {
      const fullPath = path ? `${path}/${name}` : name
      const isFolder = typeof type === 'object'
      const isExpanded = expandedFolders.has(fullPath)
      return (
        <div key={fullPath}>
          <div
            className={`flex items-center space-x-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
              !isFolder && activeFile === name
                ? 'bg-accent-primary/10 text-accent-primary'
                : 'text-text-light dark:text-text-dark'
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (isFolder) {
                const newExpanded = new Set(expandedFolders)
                if (isExpanded) {
                  newExpanded.delete(fullPath)
                } else {
                  newExpanded.add(fullPath)
                }
                setExpandedFolders(newExpanded)
              } else {
                setActiveFile(name)
              }
            }}
          >
            {isFolder ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-accent-primary" />
                ) : (
                  <Folder className="w-4 h-4 text-accent-primary" />
                )}
              </>
            ) : (
              <FileText className="w-4 h-4 ml-6 text-text-muted-light dark:text-text-muted-dark" />
            )}
            <span className="text-sm font-medium">{name}</span>
          </div>
          {isFolder && isExpanded && (
            <div>{renderFileTree(type, fullPath, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="h-full flex bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* File Explorer */}
      <div className="w-64 bg-background-secondary-light dark:bg-background-secondary-dark border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-text-light dark:text-text-dark">
            Explorer
          </h3>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          {renderFileTree(fileStructure)}
        </div>
      </div>

      {/* Editor and Terminal Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* File Tabs */}
        <div className="flex bg-background-secondary-light dark:bg-background-secondary-dark border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center px-4 py-2 bg-background-light dark:bg-background-dark border-r border-slate-200 dark:border-slate-700">
            <FileText className="w-4 h-4 mr-2 text-accent-primary" />
            <span className="text-sm text-text-light dark:text-text-dark font-medium">
              {activeFile}
            </span>
          </div>
        </div>

        {/* Editor Container */}
        <div
          className={`flex-1 relative min-h-0 ${isTerminalVisible ? 'flex-grow' : ''}`}
        >
          <MonacoEditor
            height="100%"
            language={language}
            path={activeFile}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontFamily: "JetBrains Mono, Consolas, 'Courier New', monospace",
              fontSize: settings?.fontSize || 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
              },
              // Anti-cheat: Disable some editor features
              find: {
                addExtraSpaceOnTop: false,
                autoFindInSelection: 'never',
                seedSearchStringFromSelection: 'never',
              },
              contextmenu: false,
              readOnly: false,
            }}
          />

          {/* Run Controls */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all shadow-md ${
                isRunning
                  ? 'bg-quiz-pending/20 text-quiz-pending cursor-not-allowed'
                  : 'bg-quiz-correct hover:bg-quiz-correct/90 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
            <button
              onClick={handleStopCode}
              disabled={!isRunning}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all shadow-md ${
                !isRunning
                  ? 'bg-slate-500/20 text-slate-500 cursor-not-allowed'
                  : 'bg-quiz-incorrect hover:bg-quiz-incorrect/90 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          </div>
        </div>

        {/* Terminal */}
        {isTerminalVisible && (
          <div className="h-28 bg-code-dark border-t border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-background-secondary-light dark:bg-background-secondary-dark border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-accent-primary" />
                <span className="text-sm font-medium text-text-light dark:text-text-dark">
                  Terminal
                </span>
                {isRunning && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-quiz-pending rounded-full animate-pulse"></div>
                    <span className="text-xs text-quiz-pending">Running</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  title="Clear Terminal"
                  onClick={() => setTerminalOutput('')}
                  className="text-xs text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors px-2 py-1 rounded"
                >
                  Clear
                </button>
                <button
                  title="Close Terminal"
                  type="button"
                  onClick={() => setIsTerminalVisible(false)}
                  className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-900">
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                {terminalOutput ||
                  '$ Ready to execute code...\n$ Use the Run button to execute your code\n'}
              </pre>
              {isRunning && (
                <div className="flex items-center space-x-2 text-quiz-pending">
                  <div className="w-2 h-2 bg-quiz-pending rounded-full animate-ping"></div>
                  <span className="text-sm">Executing...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show Terminal Button (when hidden) */}
        {!isTerminalVisible && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-2 bg-background-secondary-light dark:bg-background-secondary-dark">
            <button
              onClick={() => setIsTerminalVisible(true)}
              className="flex items-center space-x-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-primary transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>Show Terminal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
