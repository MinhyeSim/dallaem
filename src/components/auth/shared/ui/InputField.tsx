import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isPasswordField?: boolean;
  isPasswordVisible?: boolean;
  handlePasswordVisibility?: () => void;
  error?: string;
  isSubmitted?: boolean;
  errorResponseMessage?: string | null;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      isPasswordField = false,
      isPasswordVisible = false,
      handlePasswordVisibility,
      error,
      isSubmitted,
      errorResponseMessage,
      type,
      ...rest
    },
    ref
  ) => {
    const inputType = isPasswordField
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type ?? 'text';

    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={inputType}
            aria-invalid={isSubmitted ? (error ? 'true' : 'false') : undefined} 
            className={`w-full rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
              error || errorResponseMessage
                ? 'border border-red-500 bg-red-50 focus:ring-red-500'
                : 'bg-gray-100 focus:ring-orange-500'
            }`}
            {...rest}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {isPasswordVisible ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
            </button>
          )}
        </div>
        {errorResponseMessage ? (
          <p className="text-sm text-red-500 mt-1">{errorResponseMessage}</p>
        ) : (
          error && <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
