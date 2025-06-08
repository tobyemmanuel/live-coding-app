import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  className,
  disabled
}) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return (
    <button className={`${variantClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
