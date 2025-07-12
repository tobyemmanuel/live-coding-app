import React from 'react'
import { useParams } from 'react-router-dom'
import { useSubmission } from '../services/examApi'
import { Card } from '../components/common/Card'
import { useAuthStore } from '../stores/authStore'
import { useExams } from '../services/examApi'
import {
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Building,
} from 'lucide-react'

export const ExamSummary: React.FC = () => {
  const { examId } = useParams<{ examId: string }>()
  const { user } = useAuthStore()
  const { data: submissionData, isPending: isSubmissionPending } =
    useSubmission(examId!, user?.id!)
  const { data: examsData, isPending: isExamsPending } = useExams(
    user?.email || ''
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-quiz-incorrect mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
            Authentication Required
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Please log in to view your exam summary.
          </p>
        </Card>
      </div>
    )
  }

  if (isSubmissionPending || isExamsPending) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Loading your exam results...
          </p>
        </div>
      </div>
    )
  }

  if (!submissionData?.data || !examsData?.data) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
            No Submission Found
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            We couldn't find any submission data for this exam.
          </p>
        </Card>
      </div>
    )
  }

  const exam = examsData.data.find((e) => e.id === examId)
  if (!exam) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-quiz-incorrect mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
            Exam Not Found
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            The requested exam could not be found.
          </p>
        </Card>
      </div>
    )
  }

  const score = submissionData.data.score || 0
  const answeredQuestions = Object.keys(submissionData.data.answers).length
  const isPassed = score && score >= 60 // Assuming 60% is passing
  const scoreColor =
    score >= 80
      ? 'text-quiz-correct'
      : score >= 60
        ? 'text-quiz-pending'
        : 'text-quiz-incorrect'

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isPassed ? 'bg-quiz-correct/10' : 'bg-quiz-incorrect/10'
            }`}
          >
            {isPassed ? (
              <Trophy className="w-10 h-10 text-quiz-correct" />
            ) : (
              <AlertCircle className="w-10 h-10 text-quiz-incorrect" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            Exam Complete!
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
            Here's your performance summary
          </p>
        </div>

        <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-quiz mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
              {exam.title}
            </h2>
            <div className="flex items-center justify-center space-x-4 text-text-muted-light dark:text-text-muted-dark">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{exam.duration} minutes</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-accent-primary/10 to-live-typing/10 border-4 border-accent-primary/20 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${scoreColor}`}>
                  {score ? `${score}%` : '--'}
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {score ? (isPassed ? 'Passed' : 'Failed') : 'Pending'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-xl">
              <CheckCircle className="w-8 h-8 text-quiz-correct mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-light dark:text-text-dark">
                {answeredQuestions}
              </div>
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Questions Answered
              </div>
            </div>

            <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-xl">
              <Clock className="w-8 h-8 text-accent-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-light dark:text-text-dark">
                {exam.duration}
              </div>
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Minutes Allocated
              </div>
            </div>

            <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-xl">
              <Trophy
                className={`w-8 h-8 mx-auto mb-2 ${isPassed ? 'text-quiz-correct' : 'text-slate-400'}`}
              />
              <div className="text-2xl font-bold text-text-light dark:text-text-dark">
                {isPassed ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Final Result
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-accent-primary" />
              <span>Exam Information</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Title:
                </span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {exam.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Duration:
                </span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {exam.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Date:
                </span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {new Date(exam.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-accent-primary" />
              <span>Exam Details</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Examiner:
                </span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {exam.examiner || 'Tobi Oluwaseun'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Organization:
                </span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {exam.organization || 'Tobi Oluwaseun'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Status:
                </span>
                <span
                  className={`font-medium ${isPassed ? 'text-quiz-correct' : 'text-quiz-incorrect'}`}
                >
                  {score ? (isPassed ? 'Passed' : 'Failed') : 'Under Review'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8 p-6 bg-gradient-to-r from-accent-primary/5 to-live-typing/5 rounded-xl border border-accent-primary/10">
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {isPassed
              ? 'Congratulations! Your results have been recorded and will be shared with the examiner.'
              : "Don't worry! Use this as a learning opportunity. You can retake the exam if permitted."}
          </p>
        </div>
      </div>
    </div>
  )
}
