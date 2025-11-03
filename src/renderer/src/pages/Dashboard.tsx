import React, {useEffect} from 'react'
import { useAuthStore } from '../stores/authStore'
import { useExams } from '../services/examApi'
import { Card } from '../components/common/Card'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import {
  Calendar,
  Clock,
  Users,
  Building,
  FileText,
  User as UserIcon,
  CheckCircle,
  Code,
  Trophy,
  Play,
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const { data, isLoading } = useExams(user?.email || '')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )

  const exams = data?.data || []

  // Calculate counts for tiles
  const totalExams = exams.length
  const upcomingExams = exams.filter(
    (e) => new Date(e.scheduledDate) > new Date()
  ).length
  const examiners = new Set(exams.map((e) => e.examiner)).size
  const organizations = new Set(exams.map((e) => e.organization)).size

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-accent-primary/10 to-live-typing/10 dark:from-accent-primary/5 dark:to-live-typing/5 rounded-2xl p-6 mb-8 border border-accent-primary/20 dark:border-accent-primary/10">
          <div className="flex items-center space-x-6">
            {user.photo ? (
              <img
                src={user.photo}
                alt={`${user.name} avatar`}
                className="w-20 h-20 rounded-full object-cover border-3 border-accent-primary shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {user.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || <UserIcon className="w-10 h-10" />}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
                Ready to tackle some coding challenges? Here's your exam overview.
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-live-indicator rounded-full animate-pulse"></div>
                  <span className="text-sm text-live-indicator font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {upcomingExams} exams ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Total Exams</p>
                <p className="text-3xl font-bold text-accent-primary mt-1">{totalExams}</p>
              </div>
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-quiz-pending mt-1">{upcomingExams}</p>
              </div>
              <div className="w-12 h-12 bg-quiz-pending/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-quiz-pending" />
              </div>
            </div>
          </Card>

          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Examiners</p>
                <p className="text-3xl font-bold text-live-typing mt-1">{examiners}</p>
              </div>
              <div className="w-12 h-12 bg-live-typing/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-live-typing" />
              </div>
            </div>
          </Card>

          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Organizations</p>
                <p className="text-3xl font-bold text-live-indicator mt-1">{organizations}</p>
              </div>
              <div className="w-12 h-12 bg-live-indicator/10 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-live-indicator" />
              </div>
            </div>
          </Card>
        </div>

        {/* Exams section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-accent-primary" />
              <span>Available Exams</span>
            </h2>
            {upcomingExams > 0 && (
              <div className="bg-quiz-pending/10 text-quiz-pending px-3 py-1 rounded-full text-sm font-medium">
                {upcomingExams} upcoming
              </div>
            )}
          </div>
        </div>

        {/* Exams grid */}
        {exams.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
              No exams scheduled
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Check back later for new coding challenges and assessments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card
                key={exam.id}
                className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-102 overflow-hidden group"
              >
                {/* Exam image */}
                <div className="relative overflow-hidden">
                  <img
                    src={exam.imageUrl || 'https://via.placeholder.com/400x200?text=Coding+Challenge'}
                    alt={exam.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-accent-primary" />
                      <span className="text-sm font-medium text-text-light dark:text-text-dark">
                        {exam.duration}m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 group-hover:text-accent-primary transition-colors">
                    {exam.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-text-muted-light dark:text-text-muted-dark">
                      <Calendar className="w-5 h-5 text-accent-primary" />
                      <span className="font-medium">
                        {new Date(exam.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted-light dark:text-text-muted-dark">Examiner:</span>
                        <span className="font-medium text-text-light dark:text-text-dark">
                          {exam?.examiner || "Tobi Oluwaseun"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted-light dark:text-text-muted-dark">Organization:</span>
                        <span className="font-medium text-text-light dark:text-text-dark">
                          {exam?.organization || "Tobi Oluwaseun"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/exam-entry/${exam.id}`)}
                    className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-semibold py-3 px-4 rounded-lg shadow-live transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Exam</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}