import { useQuery, useMutation } from '@tanstack/react-query'
import { Exam, ExamSubmission, ExamCredentials } from '../types/exam'
import { ApiResponse } from './types'

const fetchExams = async (email: string): Promise<ApiResponse<Exam[]>> => {
  // Simulated API call
  const response = await fetch(`/api/exams?email=${email}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

const fetchExam = async (
  credentials: ExamCredentials
): Promise<ApiResponse<Exam>> => {
  // Simulated API call
  const response = await fetch('/api/exam', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  return response.json()
}

const submitExam = async (
  submission: ExamSubmission
): Promise<ApiResponse<ExamSubmission>> => {
  // Simulated API call
  const response = await fetch('/api/exam/submit', {
    method: 'POST',
    body: JSON.stringify(submission),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

const fetchSubmission = async (
  examId: string,
  studentId: string
): Promise<ApiResponse<ExamSubmission>> => {
  // Simulated API call
  const response = await fetch(
    `/api/exam/submission?examId=${examId}&studentId=${studentId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return response.json()
}

export const useExams = (email: string) =>
  useQuery({
    queryKey: ['exams', email],
    queryFn: () => fetchExams(email),
  })
export const useExam = () => useMutation({ mutationFn: fetchExam })
export const useSubmitExam = () => useMutation({ mutationFn: submitExam })
export const useSubmission = (examId: string, studentId: string) =>
  useQuery({
    queryKey: ['submission', examId, studentId],
    queryFn: () => fetchSubmission(examId, studentId),
  })
