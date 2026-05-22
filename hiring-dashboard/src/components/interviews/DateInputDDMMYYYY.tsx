import { ShadcnInput } from '@/components/ui/shadcn-input'
import { cn } from '@/utils'

interface DateInputDDMMYYYYProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  id?: string
  className?: string
  disabled?: boolean
}

/** Text date field with DD/MM/YYYY placeholder (replaces native date input hint) */
export function DateInputDDMMYYYY({
  value,
  onChange,
  onBlur,
  id,
  className,
  disabled,
}: DateInputDDMMYYYYProps) {
  return (
    <ShadcnInput
      id={id}
      type="text"
      inputMode="numeric"
      placeholder="DD/MM/YYYY"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={cn(className)}
      aria-label="Date (DD/MM/YYYY)"
    />
  )
}
