'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        {...props}
      />
    </div>
  )
}
