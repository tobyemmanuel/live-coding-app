import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useExams } from '../services/examApi'
import { Card } from '../components/common/Card'
import { useNavigate } from 'react-router-dom'

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

  // Pagination state (current page)
  const [currentPage, setCurrentPage] = useState(1)

  if (!user)
    return (
      <div className="text-center text-red-600 font-semibold py-10">
        Please log in to view exams.
      </div>
    )
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    )

  const exams = data?.data || []

  // Pagination calculations
  const totalPages = Math.ceil(exams.length / pageSize)
  const paginatedExams = exams.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Helper: Render pagination buttons placeholder
  const Pagination = () => (
    <div className="flex justify-center space-x-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        className="px-3 py-1 rounded border border-indigo-600 text-indigo-600 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-3 py-1 font-semibold">
        Page {currentPage} of {totalPages || 1}
      </span>

      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className="px-3 py-1 rounded border border-indigo-600 text-indigo-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">All Exams</h2>

      {exams.length === 0 ? (
        <p className="text-center text-gray-500">No exams available at the moment.</p>
      ) : (
        <>
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col space-y-4'
            }
          >
            {paginatedExams.map((exam) => (
              <Card
                key={exam.id}
                className={`p-5 transition-shadow hover:shadow-lg cursor-pointer ${
                  layout === 'list' ? 'flex items-center justify-between' : ''
                }`}
                onClick={() => navigate(`/exam-summary/${exam.id}`)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-1">{exam.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    📅 <strong>Date:</strong> {exam.scheduledDate}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    ⏱ <strong>Duration:</strong> {exam.duration} minutes
                  </p>
                </div>
                {layout === 'list' && (
                  <button
                    className="btn-primary ml-4 whitespace-nowrap px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/exam-summary/${exam.id}`)
                    }}
                  >
                    View Summary
                  </button>
                )}
              </Card>
            ))}
          </div>

          {totalPages > 1 && <Pagination />}
        </>
      )}
    </div>
  )
}
