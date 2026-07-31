import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  icon,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}

        <input
          id={inputId}
          {...props}
          className={`
            w-full px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
        />
      </div>

      {error && <p className="text-sm text-red-600 flex items-center gap-1">❌ {error}</p>}
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          transition-colors resize-none
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      />

      {error && <p className="text-sm text-red-600 flex items-center gap-1">❌ {error}</p>}
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  hint,
  options,
  id,
  className = '',
  ...props
}: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        id={inputId}
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg appearance-none
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          transition-colors bg-white cursor-pointer
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600 flex items-center gap-1">❌ {error}</p>}
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
