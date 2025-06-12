import { InputHTMLAttributes } from 'react'

type InputProps = {
  label: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={props.name} className="block text-sm text-gray-900 font-bold">
        {label}
      </label>
      <input
        id={props.name}
        className={`w-full rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border border-red-500 bg-red-50 focus:ring-red-500'
            : 'bg-gray-100 focus:ring-orange-500'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
