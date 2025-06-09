import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { createSplashWindow } from './splash'
import os from 'node:os'
import fs from 'node:fs'
// import axios from 'axios'
// import { executeCode } from './code-execution 

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until splash is done
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    frame: true,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close()
      splashWindow = null
    }
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  // Show splash screen first
  splashWindow = createSplashWindow()

  // Wait a bit then create main window
  setTimeout(() => {
    createMainWindow()
  }, 2000)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform', () => {
  return process.platform
})

// Anti-cheating: Prevent window minimize/hide during exam
ipcMain.on('exam-started', () => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(true)
    mainWindow.setFullScreen(true)
    mainWindow.setMinimizable(false)
  }
})

ipcMain.on('exam-ended', () => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false)
    mainWindow.setFullScreen(false)
    mainWindow.setMinimizable(true)
  }
})

// Code execution handler
ipcMain.handle('execute-code', async (event, { code, language, testCases }) => {
  try {
    // const results = await executeCode(code, language, testCases)
    // return { success: true, results }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-system-info', async () => {
  try {
    return {
      hostname: os.hostname(),
      cpus: os.cpus().length,
      platform: os.platform(),
      release: os.release(),
    }
  } catch (error: any) {
    throw new Error(`Failed to get system info: ${error.message}`)
  }
})

// File operations handlers
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}`)
  }
})

ipcMain.handle('write-file', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data)
    return true
  } catch (error: any) {
    throw new Error(`Failed to write file: ${error.message}`)
  }
})

ipcMain.handle('submit-answers', async (_event, { examId, answers }) => {
  // Send to backend
  return { status: 'success', message: 'Answers submitted successfully' } // Replace with actual result later
  // try {
  //   const response = await axios.post(
  //     'http://backend/api/submit',
  //     { examId, answers },
  //     { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  //   )
  //   return response.data
  // } catch (error) {
  //   throw new Error('Submission failed')
  // }
})

ipcMain.handle('exit-exam', async () => {
  app.quit()
})

ipcMain.handle('get-exam-settings', async (_event, examId) => {
  // Mock settings (replace with backend call)
  return {
    showResults: 'afterApproval', // Or 'instant' based on admin config
  }
})

ipcMain.handle('get-approved-results', async (_event, examId) => {
  // Mock approved results (replace with backend call)
  return {
    results: null, // Simulate pending approval
    // results: [...], // Return approved results when available
  }
})
