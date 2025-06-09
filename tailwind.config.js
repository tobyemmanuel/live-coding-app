/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,html,css}',
    './src/renderer/src/index.css',
    './src/renderer/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary backgrounds
        background: {
          light: '#f8fafc',      // Very light gray instead of pure white
          dark: '#1a1d29',       // Deep navy for dark theme
          secondary: {
            light: '#f1f5f9',    // Slightly darker light gray
            dark: '#2d3748',     // Charcoal for secondary dark areas
          },
        },
        
        // Text colors
        text: {
          light: '#1e293b',      // Dark slate for light theme
          dark: '#e2e8f0',       // Light gray for dark theme
          muted: {
            light: '#64748b',    // Muted slate for light theme
            dark: '#94a3b8',     // Lighter muted for dark theme
          },
        },

        // Code editor backgrounds
        code: {
          light: '#f1f5f9',      // Light gray for code blocks
          dark: '#0f172a',       // Very dark slate for code blocks
        },

        // Interactive elements - Bright cyan/blue accent
        accent: {
          primary: '#00BFFF',    // Bright cyan for primary actions
          secondary: '#3b82f6',  // Electric blue for secondary actions
          hover: '#0ea5e9',      // Darker cyan for hover states
        },

        // Quiz state colors
        quiz: {
          correct: '#10b981',    // Emerald green for correct answers
          incorrect: '#ef4444',  // Coral red for incorrect answers
          pending: '#fbbf24',    // Soft yellow for pending/highlight
          neutral: '#6b7280',    // Gray for neutral states
        },

        // Live features
        live: {
          indicator: '#22c55e',  // Green for live indicators
          notification: '#f59e0b', // Amber for notifications
          typing: '#8b5cf6',     // Purple for typing indicators
        },

        // Enhanced slate palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // Existing color palette (keeping for compatibility)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e40af',
        },
        
        green: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#991b1b',
        },
        
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#9a3412',
        },
        
        purple: {
          400: '#a855f7',
          600: '#9333ea',
        },
        
        teal: {
          400: '#2dd4bf',
          600: '#0d9488',
        },

        // Additional utility colors
        yellow: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },

        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },

      // Custom animations for live features
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },

      // Custom box shadows for depth
      boxShadow: {
        'quiz': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'code': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'live': '0 0 0 3px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
};