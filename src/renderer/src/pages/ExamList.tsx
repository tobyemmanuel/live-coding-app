import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useExams } from '../services/examApi'
import { Card } from '../components/common/Card'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Eye,
  Code,
  Users,
  Building,
  AlertCircle,
} from 'lucide-react'

interface ExamListProps {
  layout?: 'grid' | 'list'
  pageSize?: number
}

export const ExamList: React.FC<ExamListProps> = ({
  layout = 'list',
  pageSize = 10,
}) => {
  const { user } = useAuthStore()
  const { data, isLoading } = useExams(user?.email || '')
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'list'>(layout)

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-quiz-incorrect/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-quiz-incorrect" />
        </div>
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
          Authentication Required
        </h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-center mb-6">
          Please sign in to view your available exams and coding challenges.
        </p>
        <button
          title="login"
          type="button"
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium px-6 py-3 rounded-lg hover:from-accent-hover hover:to-accent-primary transition-all duration-200"
        >
          Sign In
        </button>
      </div>
    )

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"></div>
          <Code className="absolute inset-0 m-auto w-6 h-6 text-accent-primary" />
        </div>
      </div>
    )

  const exams = data?.data || []
  const totalPages = Math.ceil(exams.length / pageSize)
  const paginatedExams = exams.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const Pagination = () => (
    <div className="flex items-center justify-between mt-8 px-4">
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
        Showing {(currentPage - 1) * pageSize + 1} to{' '}
        {Math.min(currentPage * pageSize, exams.length)} of {exams.length} exams
      </div>

      <div className="flex items-center space-x-2">
        <button
          title="previous"
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-secondary-light dark:bg-background-secondary-dark text-text-light dark:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-primary/10 hover:border-accent-primary/30 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                title={`${pageNum}`}
                type="button"
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'bg-accent-primary text-white'
                    : 'bg-background-secondary-light dark:bg-background-secondary-dark text-text-light dark:text-text-dark hover:bg-accent-primary/10'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          title="next"
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-secondary-light dark:bg-background-secondary-dark text-text-light dark:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-primary/10 hover:border-accent-primary/30 transition-all duration-200"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
              All Exams
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Browse through all available coding challenges and assessments
            </p>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center space-x-2 bg-background-secondary-light dark:bg-background-secondary-dark rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              title="grid"
              type="button"
              onClick={() => setSelectedLayout('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedLayout === 'grid'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              title="list"
              type="button"
              onClick={() => setSelectedLayout('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedLayout === 'list'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
              No Exams Available
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto">
              There are no coding challenges or assessments available at the
              moment. Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <>
            {/* Exams Grid/List */}
            <div
              className={
                selectedLayout === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedExams.map((exam) => (
                <Card
                  key={exam.id}
                  className={`bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-quiz hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer group ${
                    selectedLayout === 'list'
                      ? 'flex items-center justify-between p-6'
                      : 'p-6'
                  }`}
                  onClick={() => navigate(`/exam-summary/${exam.id}`)}
                >
                  {selectedLayout === 'grid' ? (
                    // Grid Layout
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-accent-primary transition-colors line-clamp-2">
                          {exam.title}
                        </h3>
                        <div className="ml-4 flex-shrink-0">
                          <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                            <Code className="w-6 h-6 text-accent-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-text-muted-light dark:text-text-muted-dark">
                          <Calendar className="w-5 h-5 text-accent-primary" />
                          <span className="font-medium">
                            {new Date(exam.scheduledDate).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-text-muted-light dark:text-text-muted-dark">
                          <Clock className="w-5 h-5 text-live-typing" />
                          <span className="font-medium">
                            {exam.duration} minutes
                          </span>
                        </div>
                      </div>

                      <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-muted-light dark:text-text-muted-dark flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Examiner:</span>
                          </span>
                          <span className="font-medium text-text-light dark:text-text-dark">
                            {exam?.examiner || 'Tobi Oluwaseun'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-muted-light dark:text-text-muted-dark flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Organization:</span>
                          </span>
                          <span className="font-medium text-text-light dark:text-text-dark">
                            {exam?.organization || 'Tobi Oluwaseun'}
                          </span>
                        </div>
                      </div>

                      <button
                        title="summary"
                        type="button"
                        className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Summary</span>
                      </button>
                    </div>
                  ) : (
                    // List Layout
                    <>
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-16 h-16 bg-accent-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Code className="w-8 h-8 text-accent-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-accent-primary transition-colors mb-2">
                            {exam.title}
                          </h3>
                          <div className="flex items-center space-x-6 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-accent-primary" />
                              <span>
                                {new Date(
                                  exam.scheduledDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-live-typing" />
                              <span>{exam.duration} mins</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-live-indicator" />
                              <span>{exam?.examiner || 'Tobi Oluwaseun'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/exam-summary/${exam.id}`)
                        }}
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Summary</span>
                      </button>
                    </>
                  )}
                </Card>
              ))}
            </div>

            {totalPages > 1 && <Pagination />}
          </>
        )}
      </div>
    </div>
  )
}
