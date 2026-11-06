export default function TaskLabels({
  labelIds = [],
  labels = [],
  showEmpty = false,
}) {
  const assignedLabels = labels.filter((label) => labelIds.includes(label.id));

  if (assignedLabels.length === 0) {
    return showEmpty ? (
      <span className='text-sm text-muted-foreground'>No labels assigned</span>
    ) : null;
  }

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {assignedLabels.map((label) => (
        <span
          key={label.id}
          className='rounded-full px-2 py-0.5 text-[11px] font-medium'
          style={{
            backgroundColor: `${label.color}20`,
            color: label.color,
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
  );
}
