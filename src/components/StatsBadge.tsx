interface StatsBadgeProps {
  type: "added" | "removed";
  count: number;
}

export default function StatsBadge({ type, count }: StatsBadgeProps) {
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
      className={`flex items-center gap-2 px-4 py-2 ${style.bg} border-2 ${style.border} rounded-xl`}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
      <span className={`text-sm font-semibold ${style.text}`}>
        {style.prefix}
        {count}
      </span>
    </div>
  );
}
