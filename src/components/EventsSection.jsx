// src/components/EventsSection.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./Button";
import AttendanceResponse from "./AttendanceResponse";

export default function EventsSection() {
  const [activeTab, setActiveTab] = useState("organized");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // THIS IS THE FIXED, CLEAN, WORKING VERSION
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "organized" ? "/events/organized" : "/events/invited";
      const res = await api.get(endpoint);

      let eventList = [];

      if (Array.isArray(res.data)) {
        eventList = res.data;
      } else if (res.data?.events && Array.isArray(res.data.events)) {
        eventList = res.data.events;
      } else if (res.data?.event) {
        eventList = [res.data.event];
      }

      setEvents(eventList);
    } catch (err) {
      console.error("Failed to load events:", err);
      toast.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const deleteEvent = async (id) => {
    if (!id || !confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const inviteUser = async (eventId) => {
    if (!eventId) return;
    const email = prompt("Enter email to invite:")?.trim();
    if (!email) return;

    try {
      await api.post(`/events/${eventId}/invite`, { email });
      toast.success("Invitation sent!");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite");
    }
  };

  const showAttendees = async (eventId) => {
    if (!eventId) return;
    try {
      const res = await api.get(`/events/${eventId}/attendees`);
      const list = res.data
        .map((a) => `• ${a.user?.email || "Unknown"} — ${a.status || "No response"}`)
        .join("\n");
      alert("Attendees:\n\n" + (list || "No attendees yet"));
    } catch (err) {
      toast.error("Failed to load attendees");
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-xl">Loading events...</p>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-600">
          {activeTab === "organized" ? "No events created yet" : "No invitations yet"}
        </p>
        <p className="text-gray-500 mt-4">Click "+ Create New Event" to start!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-300 mb-8">
        <div className="flex gap-12">
          <button
            onClick={() => setActiveTab("organized")}
            className={`pb-4 px-2 font-semibold border-b-4 transition-all ${
              activeTab === "organized"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Organized Events
          </button>
          <button
            onClick={() => setActiveTab("invited")}
            className={`pb-4 px-2 font-semibold border-b-4 transition-all ${
              activeTab === "invited"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Events I'm Invited To
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
           <div key={event.id ?? `event-${index}`}// This is now 100% safe and unique
            className="bg-white rounded-xl shadow-lg p-7 hover:shadow-2xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  event.role === "organizer"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {event.role === "organizer" ? "Organizer" : "Attendee"}
              </span>
            </div>

            <div className="space-y-3 text-gray-600 mb-6">
              <p className="text-lg">{event.date} at {event.time}</p>
              <p className="text-lg">{event.location}</p>
              {event.description && <p className="pt-3 text-gray-700 italic">{event.description}</p>}
            </div>

            {event.role === "attendee" && (
              <AttendanceResponse eventId={event.id} currentStatus={event.status} onUpdate={fetchEvents} />
            )}

            {event.role === "organizer" && (
              <div className="flex flex-wrap gap-3 mt-6">
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
    </div>
  );
}