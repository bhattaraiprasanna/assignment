import { forwardRef, InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`
          flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
          ring-offset-background placeholder:text-gray-400 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
