import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const statusConfig = {
  Going: { label: "Going", color: "bg-green-100 text-green-800" },
  Maybe: { label: "Maybe", color: "bg-yellow-100 text-yellow-800" },
  "Not Going": { label: "Not Going", color: "bg-red-100 text-red-800" },
};

export default function AttendanceResponse({ eventId, currentStatus, onUpdate }) {
  const [status, setStatus] = useState(currentStatus || null);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await api.post(`/events/${eventId}/respond`, { status: newStatus });
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}!`);
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Your attendance:</p>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusConfig).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => updateStatus(key)}
            disabled={loading || status === key}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              status === key
                ? `${color} ring-2 ring-offset-2 ring-brand-accent`
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading && status === key ? "Saving..." : label}
          </button>
        ))}
      </div>
      {status && (
        <p className="text-xs text-gray-500 mt-2">
          You are marked as: <span className="font-medium">{status}</span>
        </p>
      )}
    </div>
  );
}