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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-center space-x-4 mb-8">
        {user.photo ? (
          <img
            src={user.photo}
            alt={`${user.name} avatar`}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl border-2 border-indigo-600">
            {user.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || <UserIcon className="w-8 h-8" />}
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">
            Welcome back, {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here is your exam overview and upcoming schedule.
          </p>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Card className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl shadow hover:shadow-lg transition">
          <FileText className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Exams</p>
            <p className="text-2xl font-bold text-indigo-700">{totalExams}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl shadow hover:shadow-lg transition">
          <Calendar className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Upcoming Exams</p>
            <p className="text-2xl font-bold text-indigo-700">{upcomingExams}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl shadow hover:shadow-lg transition">
          <Users className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Examiners</p>
            <p className="text-2xl font-bold text-indigo-700">{examiners}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 p-6 border border-gray-200 rounded-xl shadow hover:shadow-lg transition">
          <Building className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Organizations</p>
            <p className="text-2xl font-bold text-indigo-700">{organizations}</p>
          </div>
        </Card>
      </div>

      {/* Exams list */}
      {exams.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          <p>No scheduled exams at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="p-5 bg-white dark:bg-slate-800 shadow hover:shadow-lg transition duration-300 border border-gray-200 dark:border-slate-700 rounded-xl"
            >
              {/* Exam image */}
              <img
                src={exam.imageUrl || 'https://via.placeholder.com/400x180?text=Exam+Image'}
                alt={exam.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                {exam.title}
              </h4>

              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300 mb-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                <Clock className="w-5 h-5 ml-4" />
                <span>{exam.duration} mins</span>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Examiner: </strong>
                  {exam?.examiner || "Tobi Oluwaseun"}
                </p>
                <p>
                  <strong>Organization: </strong>
                  {exam?.organization|| "Tobi Oluwaseun"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/exam-entry/${exam.id}`)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
              >
                Start Exam
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
