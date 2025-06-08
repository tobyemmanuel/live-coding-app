import React, { useState } from 'react'
import { useLogin } from '../../services/authApi'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const { mutate: login, isPending } = useLogin()
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = () => {
    login(credentials, {
      onSuccess: ({ data }) => {
        setUser(data)
        navigate('/dashboard')
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl rounded-xl w-full max-w-md p-8 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700 dark:text-indigo-400">
          DevByteTest
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-8">
          Live exam platform with live coding
        </p>

        <Input
          type="email"
          value={credentials.email}
          onChange={(email) => setCredentials({ ...credentials, email })}
          placeholder="Email Address"
          className="mb-4 w-full"
        />
        <Input
          type="password"
          value={credentials.password}
          onChange={(password) => setCredentials({ ...credentials, password })}
          placeholder="Password"
          className="mb-6 w-full"
        />

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-2"
        >
          {isPending ? 'Logging in...' : 'Sign In'}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <span
            className="text-blue-200 dark:text-indigo-300 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>           <span
            className="text-blue-200 dark:text-indigo-300 hover:underline cursor-pointer"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  )
}
