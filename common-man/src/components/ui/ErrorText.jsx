export function ErrorText({ children }) {
  if (!children) return null;

  return (
    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {typeof children === "string" ? children : children.message}
    </div>
  );
}