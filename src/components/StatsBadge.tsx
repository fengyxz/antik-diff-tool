interface StatsBadgeProps {
  type: "added" | "removed";
  count: number;
  unit?: "字符" | "行";
}

export default function StatsBadge({ type, count, unit = "字符" }: StatsBadgeProps) {
  const styles = {
    added: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      text: "text-emerald-900",
      prefix: "+",
    },
    removed: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      dot: "bg-rose-500",
      text: "text-rose-900",
      prefix: "-",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex items-center gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 ${style.bg} border-2 ${style.border} rounded-lg md:rounded-xl`}
    >
      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${style.dot}`} />
      <span className={`text-xs md:text-sm font-semibold ${style.text}`}>
        {style.prefix}
        {count}
      </span>
      <span className={`text-[10px] md:text-xs ${style.text} opacity-70`}>
        {unit}
      </span>
    </div>
  );
}
