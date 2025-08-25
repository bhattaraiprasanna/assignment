import * as SelectPrimitive from "@radix-ui/react-select"
import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"

// Define the props for each component explicitly
interface SelectProps extends SelectPrimitive.SelectProps {}
interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {}
interface SelectValueProps extends SelectPrimitive.SelectValueProps {}
interface SelectContentProps extends SelectPrimitive.SelectContentProps {
  position?: "popper" | "item-aligned"
}
interface SelectItemProps extends SelectPrimitive.SelectItemProps {}

const Select = forwardRef<
  HTMLDivElement,
  SelectProps
>(({ children, ...props }, forwardedRef) => (
  <SelectPrimitive.Root {...props}>
    <SelectPrimitive.Group ref={forwardedRef}>
      {children}
    </SelectPrimitive.Group>
  </SelectPrimitive.Root>
))

Select.displayName = "Select"

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, ...props }, forwardedRef) => (
  <SelectPrimitive.Trigger
    ref={forwardedRef}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

SelectTrigger.displayName = "SelectTrigger"

const SelectValue = forwardRef<
  HTMLSpanElement,
  SelectValueProps
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitive.Value
    ref={forwardedRef}
    className={`text-sm ${className || ''}`}
    {...props}
  />
))

SelectValue.displayName = "SelectValue"

const SelectContent = forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ className, children, position = "popper", ...props }, forwardedRef) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={forwardedRef}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${position === "popper" ? "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1" : ""} ${className || ''}`}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={`p-1 ${position === "popper" ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]" : ""}`}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

SelectContent.displayName = "SelectContent"

const SelectItem = forwardRef<
  HTMLDivElement,
  SelectItemProps
>(({ className, children, ...props }, forwardedRef) => (
  <SelectPrimitive.Item
    ref={forwardedRef}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))

SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }