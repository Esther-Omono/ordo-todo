export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className='w-full space-y-1.5'>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-foreground'
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        className={`
          w-full rounded-md border bg-surface px-3 py-2.5
          text-sm text-foreground outline-none
          placeholder:text-muted-foreground
          transition-colors
          focus:border-primary focus:ring-2 focus:ring-primary/20
          ${error ? 'border-danger' : 'border-border'}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} role='alert' className='text-xs text-danger'>
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className='text-xs text-muted-foreground'>
          {hint}
        </p>
      )}
    </div>
  );
}
