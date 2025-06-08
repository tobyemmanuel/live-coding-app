import React, { useState } from 'react'
// import { useForgotPassword } from '../../services/authApi'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
//   const { mutate: forgotPassword, isPending, isSuccess, isError, error } = useForgotPassword()
  const navigate = useNavigate()

  const handleSubmit = () => {
    // forgotPassword(email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl rounded-xl w-full max-w-md p-8 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-3xl font-bold text-center mb-2 text-purple-700 dark:text-indigo-400">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-8">
          Enter your email to receive password reset instructions.
        </p>

        <Input
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Email Address"
          className="mb-6 w-full"
        />

        <Button
          onClick={handleSubmit}
        //   disabled={isPending || !email}
          className="w-full py-2"
        >
            Send Reset Link
          {/* {isPending ? 'Sending...' : 'Send Reset Link'} */}
        </Button>

        {/* {isSuccess && (
          <p className="mt-4 text-green-600 dark:text-green-400 text-center">
            Reset instructions sent! Please check your email.
          </p>
        )} */}

        {/* {isError && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center">
            {(error as any)?.message || 'Failed to send reset instructions.'}
          </p>
        )} */}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Remembered your password?{' '}
          <span
            className="text-blue-200 dark:text-indigo-300 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
