import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { config } from 'dotenv'
import { settingsRouter } from './routes/settings'
import { initDatabase } from './database/db'
import { connectDB } from './config/db.ts';
import auth from './routes/auth-route.ts'
import exam from './routes/exam-route';
import organisation from './routes/organisation-route.ts';
import question from './routes/question-route.ts';
import group from './routes/grouping-route.ts'


config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Initialize database
initDatabase()
// Routes
app.use('/api/settings', settingsRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})

app.use('/api', auth);
app.use('/api', exam);
app.use('/api', organisation);
app.use('/api', question);
app.use('/api', group)
// Error handling middleware   
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Server error:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }
)

// 404 handler
app.use(/^\/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
// Connect to the database
connectDB()
  .then(() => {
    console.log('✅ Database connection established')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  });
app.listen(PORT, () => {

  console.log(`🚀 API Server running on http://localhost:${PORT}`)
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
