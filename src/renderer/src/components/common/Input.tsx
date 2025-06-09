import React from 'react'

interface InputProps {
  type?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  min?: string | number
  max?: string | number
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  disabled,
  min,
  max
}) => {
  return (
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`border rounded-md p-2 ${className}`}
    />
  )
}
