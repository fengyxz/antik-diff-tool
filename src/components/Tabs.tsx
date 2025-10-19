interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: Array<{
    value: string;
    label: string;
  }>;
}

export default function Tabs({ value, onValueChange, tabs }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            value === tab.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
