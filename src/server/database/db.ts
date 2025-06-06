import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

interface AppSettings {
  theme: 'light' | 'dark'
  autoStart: boolean
  notifications: boolean
  language: string
  apiEndpoint: string
}

const DB_DIR = join(process.cwd(), 'data')
const DB_PATH = join(DB_DIR, 'app.db')

let db: Database.Database

export function initDatabase() {
  // Create data directory if it doesn't exist
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }

  db = new Database(DB_PATH)

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Insert default settings if they don't exist
  const defaultSettings: AppSettings = {
    theme: 'light',
    autoStart: false,
    notifications: true,
    language: 'en',
    apiEndpoint: 'http://localhost:3001',
  }

  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)
  `)

  Object.entries(defaultSettings).forEach(([key, value]) => {
    insertSetting.run(key, JSON.stringify(value))
  })

  console.log('✅ Database initialized successfully')
}

export async function getSettings(): Promise<AppSettings> {
  const stmt = db.prepare('SELECT key, value FROM settings')
  const rows = stmt.all() as Array<{ key: string; value: string }>

  const settings: Partial<AppSettings> = {}

  rows.forEach((row) => {
    try {
      settings[row.key as keyof AppSettings] = JSON.parse(row.value)
    } catch (error) {
      console.error(`Error parsing setting ${row.key}:`, error)
    }
  })

  return settings as AppSettings
}

export async function updateSettings(
  newSettings: Partial<AppSettings>
): Promise<AppSettings> {
  const updateStmt = db.prepare(`
    INSERT OR REPLACE INTO settings (key, value, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `)

  Object.entries(newSettings).forEach(([key, value]) => {
    updateStmt.run(key, JSON.stringify(value))
  })

  return getSettings()
}

export function closeDatabase() {
  if (db) {
    db.close()
  }
}

// Graceful shutdown
process.on('SIGINT', closeDatabase)
process.on('SIGTERM', closeDatabase)
