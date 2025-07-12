import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExam } from '../services/examApi'
import { useExamStore } from '../stores/examStore'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'

export const ExamEntry: React.FC = () => {
  const { examId } = useParams<{ examId: string }>()
  const [studentCode, setStudentCode] = useState('')
  const { mutate: fetchExam, isPending } = useExam()
  const { setCurrentExam } = useExamStore()
  const navigate = useNavigate()

  const handleSubmit = () => {
    fetchExam(
      { examId: examId!, studentCode },
      {
        onSuccess: ({ data }) => {
          setCurrentExam(data)
          navigate(`/exam/${examId}`)
        },
      }
    )
  }

  return (
    <div className="h-full w-full bg-background-light dark:bg-background-dark flex align-middle items-center justify-center ">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-live-typing/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-background-light/95 dark:bg-background-secondary-dark/95 backdrop-blur-lg border border-slate-200/20 dark:border-slate-700/30 shadow-2xl rounded-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Begin Exam
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
            To begin the exam, enter the exam ID and student code provided to
            you.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              value={examId || ''}
              onChange={() => {}}
              placeholder="Exam ID"
              className="w-full"
            />
            <Input
              value={studentCode}
              onChange={setStudentCode}
              placeholder="Student Code"
              className="w-full"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-semibold py-3 px-4 rounded-lg shadow-live transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'Start Exam'
            )}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center space-y-2">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              <button
                className="text-accent-primary hover:text-accent-hover font-medium transition-colors duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Go Back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
