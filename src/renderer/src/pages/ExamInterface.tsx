import React, { useEffect, useState } from 'react'
import { useExamStore } from '../stores/examStore'
import { useSubmitExam } from '../services/examApi'
import { QuestionNavigator } from '@/components/exam/QuestionNavigator'
import { QuestionTypes } from '@/components/exam/QuestionTypes'
import { Button } from '@/components/common/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Clock, FileText, User } from 'lucide-react'

export const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>()
  const { currentExam, currentQuestion, answers, setAnswer } = useExamStore()
  const { user } = useAuthStore()
  const { mutate: submitExam, isPending } = useSubmitExam()
  const navigate = useNavigate()

  const [timeRemaining, setTimeRemaining] = useState(7200) // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!currentExam || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Loading exam...
          </p>
        </div>
      </div>
    )
  }

  const question = currentExam.questions[currentQuestion]

  const handleSubmit = () => {
    submitExam(
      { examId: examId!, studentId: user.id, answers },
      { onSuccess: () => navigate(`/exam-summary/${examId}`) }
    )
  }
  
  const progress = ((currentQuestion + 1) / currentExam.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <div className="bg-background-secondary-light dark:bg-background-secondary-dark border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-accent-primary" />
              <h1 className="text-xl font-semibold text-text-light dark:text-text-dark">
                {currentExam.title}
              </h1>
            </div>

            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining < 600
                  ? 'bg-quiz-incorrect/10 text-quiz-incorrect'
                  : 'bg-quiz-pending/10 text-quiz-pending'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Question {currentQuestion + 1} of {currentExam.questions.length}
              </span>
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {user.name}
              </span>
            </div>
            <div className="w-2 h-2 bg-live-indicator rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Question Navigator Sidebar */}
        <div className="w-64 bg-background-secondary-light dark:bg-background-secondary-dark border-r border-slate-200 dark:border-slate-700">
          <QuestionNavigator />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Question Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mx-auto">
              <div className="bg-background-light dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                    Question {currentQuestion + 1} of{' '}
                    {currentExam.questions.length}
                  </h2>
                  <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium">
                    {question.type.toUpperCase()}
                  </span>
                </div>

                <QuestionTypes
                  question={question}
                  answer={answers[question.id]}
                  onAnswerChange={(answer) => setAnswer(question.id, answer)}
                />
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-background-secondary-light dark:bg-background-secondary-dark border-t border-slate-200 dark:border-slate-700 px-6 py-4">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button
                onClick={() =>
                  useExamStore
                    .getState()
                    .setCurrentQuestion(currentQuestion - 1)
                }
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {Object.keys(answers).length} of{' '}
                  {currentExam.questions.length} answered
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-quiz-correct hover:bg-quiz-correct/90 text-white"
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Exam'
                  )}
                </Button>
              </div>

              <Button
                onClick={() =>
                  useExamStore
                    .getState()
                    .setCurrentQuestion(currentQuestion + 1)
                }
                disabled={currentQuestion === currentExam.questions.length - 1}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
