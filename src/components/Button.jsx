export default function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        w-full px-4 py-2 font-medium text-white rounded-md shadow-sm
        bg-brand-dark hover:bg-brand-medium focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50
        ${props.className || ""}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
