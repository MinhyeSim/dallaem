import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { InputHTMLAttributes } from 'react'

type PasswordInputProps = {
  label: string
  show: boolean
  toggle: () => void
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function PasswordInput({
  label,
  show,
  toggle,
  error,
  ...props
}: PasswordInputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={props.name} className="block text-sm text-gray-900 font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          id={props.name}
          type={show ? 'text' : 'password'}
          className={`w-full rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 pr-10 ${
            error
              ? 'border border-red-500 bg-red-50 focus:ring-red-500'
              : 'bg-gray-100 focus:ring-orange-500'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
