import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [role, setRole] = useState("all"); // all, organizer, attendee
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (role !== "all") params.append("role", role);

      const res = await api.get(`/events/search?${params.toString()}`);
      setResults(res.data);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword || startDate || endDate || role !== "all") {
        search();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [keyword, startDate, endDate, role]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Events</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Roles</option>
              <option value="organizer">Only My Organized</option>
              <option value="attendee">Only Invited To</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No events found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      event.role === "organizer"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {event.role === "organizer" ? "Organizer" : "Attendee"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.date), "PPP")} at {event.time}
                </p>
                <p className="text-sm text-gray-600">Location: {event.location}</p>
                {event.description && (
                  <p className="mt-3 text-gray-700">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}