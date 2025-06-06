import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  platform: process.platform,
  //platform information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // app actions
  notifyReady: () => ipcRenderer.invoke('splash-ready'),
  onSetupUpdate: (callback: any) => ipcRenderer.on('setup-update', callback),
  removeSetupUpdateListener: (callback: any) =>
    ipcRenderer.removeListener('setup-update', callback),

  // exam actions
  startExam: () => ipcRenderer.send('exam-started'),
  endExam: () => ipcRenderer.send('exam-ended'),
  submitAnswers: (data: any) => ipcRenderer.invoke('submit-answers', data),
  exitExam: () => ipcRenderer.invoke('exit-exam'),

  // testing actions
  executeCode: (data: any) => ipcRenderer.invoke('execute-code', data),
  getExamSettings: (examId: any) =>
    ipcRenderer.invoke('get-exam-settings', examId),
  getApprovedResults: (examId: any) =>
    ipcRenderer.invoke('get-approved-results', examId),

  // file actions
  readFile: (filePath: any) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: any, data: any) =>
    ipcRenderer.invoke('write-file', filePath, data),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
