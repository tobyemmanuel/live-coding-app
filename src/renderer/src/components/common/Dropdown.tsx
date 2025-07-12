import React, { useState } from 'react'

interface DropdownProps {
  options: string[]
  onSelect: (index: number) => void
}

export const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(0)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value)
    setSelected(index)
    onSelect(index)
  }

  return (
    <select
      title="Select an option"
      className="border rounded-md p-2 bg-white"
      value={selected}
      onChange={handleChange}
    >
      {options.map((option, index) => (
        <option key={index} value={index}>
          {option}
        </option>
      ))}
    </select>
  )
}
