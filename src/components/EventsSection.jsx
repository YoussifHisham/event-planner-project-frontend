import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./Button";
import AttendanceResponse from "./AttendanceResponse";

export default function EventsSection() {
  const [activeTab, setActiveTab] = useState("organized");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "organized" ? "/events/my-organized" : "/events/my-invited";
      const res = await api.get(endpoint);
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Cannot delete event");
    }
  };

  const inviteUser = async (eventId) => {
    const email = prompt("Enter email to invite:");
    if (!email) return;
    try {
      await api.post(`/events/${eventId}/invite`, { email });
      toast.success("Invitation sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite");
    }
  };

  const showAttendees = async (eventId) => {
    try {
      const res = await api.get(`/events/${eventId}/attendees`);
      const list = res.data
        .map((a) => `• ${a.user.email} → ${a.status || "No response"}`)
        .join("\n");
      alert("Attendees:\n\n" + list || "No attendees yet");
    } catch (err) {
      toast.error("Failed to load attendees");
    }
  };

  return (
    <div>
      <div className="border-b mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("organized")}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${
              activeTab === "organized"
                ? "border-brand-accent text-brand-accent"
                : "border-transparent text-gray-500"
            }`}
          >
            My Organized Events
          </button>
          <button
            onClick={() => setActiveTab("invited")}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${
              activeTab === "invited"
                ? "border-brand-accent text-brand-accent"
                : "border-transparent text-gray-500"
            }`}
          >
            Events I'm Invited To
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          {activeTab === "organized"
            ? "You haven't created any events yet."
            : "You haven't been invited to any events yet."}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
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
              <div className="text-sm text-gray-600 space-y-1">
                <p>Event Date: {event.date} at {event.time}</p>
                <p>Location: {event.location}</p>
                {event.description && <p className="mt-2">{event.description}</p>}
              </div>

              {/* Response buttons for attendees */}
              {event.role === "attendee" && (
                <AttendanceResponse
                  eventId={event.id}
                  currentStatus={event.status}
                  onUpdate={fetchEvents}
                />
              )}

              {/* Organizer actions */}
              {event.role === "organizer" && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => inviteUser(event.id)}>
                    Invite
                  </Button>
                  <Button size="sm" onClick={() => showAttendees(event.id)}>
                    View Attendees
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}