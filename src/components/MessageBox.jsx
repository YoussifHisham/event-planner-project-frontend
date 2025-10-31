export default function MessageBox({ message, type }) {
  if (!message) return null;

  const base = "p-4 rounded-md my-4 text-sm";
  const types = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div className={`${base} ${types[type] || "bg-gray-100 text-gray-800"}`}>
      {message}
    </div>
  );
}
