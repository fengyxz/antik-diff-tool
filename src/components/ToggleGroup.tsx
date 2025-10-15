interface ToggleGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}

export default function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
        {label}
      </label>
      <div className="inline-flex items-center rounded-xl bg-white border-2 border-slate-200 p-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              value === option.value
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
