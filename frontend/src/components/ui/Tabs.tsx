export interface TabItem<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="flex gap-2 border-b border-slate-800">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            active === t.key
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                active === t.key ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-500"
              }`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}