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
    <div className="h-full bg-gradient-to-br from-background-dark via-slate-900 to-background-secondary-dark dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-live-typing/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-background-light/95 dark:bg-background-secondary-dark/95 backdrop-blur-lg border border-slate-200/20 dark:border-slate-700/30 shadow-2xl rounded-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-live-typing rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="text-2xl font-bold text-white">DB</div>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            DevByteTest
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
            Welcome back! Sign in to access your tests.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              value={credentials.email}
              onChange={(email) => setCredentials({ ...credentials, email })}
              placeholder="Email Address"
              className="w-full"
            />
            <Input
              type="password"
              value={credentials.password}
              onChange={(password) =>
                setCredentials({ ...credentials, password })
              }
              placeholder="Password"
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
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center space-y-2">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Don't have an account?{' '}
              <button
                className="text-accent-primary hover:text-accent-hover font-medium transition-colors duration-200"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </p>
            <button
              className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-primary transition-colors duration-200"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-live-indicator rounded-full animate-pulse"></div>
            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
