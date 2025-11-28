import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Navbar from "../components/Navbar";

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
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-2 ">Search Events</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
          {/* Keyword Input with Label */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date with Label */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border rounded-lg"
                placeholder="Start Date"
              />
            </div>

            {/* End Date with Label */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Role Select with Label */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
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
        </div>

        {loading ? (
          <p className="text-center py-12">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No events found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((event) => (
              <div key={event.event_id || event.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      event.role === "organizer"
                        ? "bg-purple-600 text-white" 
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {event.role === "organizer" ? "Organizer" : "Attendee"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {event.date ? format(new Date(event.date), "PPP") : "No date"} at {event.time}
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