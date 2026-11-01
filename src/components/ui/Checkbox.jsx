export default function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
}) {
  return (
    <label
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
        className='
          size-4 shrink-0 cursor-pointer
          accent-primary
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
          focus-visible:ring-offset-2
        '
      />

      {label && <span className='text-sm text-foreground'>{label}</span>}
    </label>
  );
}
