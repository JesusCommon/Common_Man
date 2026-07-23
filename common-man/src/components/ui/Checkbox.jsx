// components/ui/Checkbox.jsx
export function Checkbox({ label, error, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
          {...props}
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}