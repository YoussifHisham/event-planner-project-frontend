import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./Button";
import AttendanceResponse from "./AttendanceResponse";
import CreateEventModal from "./CreateEventModal";

export default function EventsSection() {
  const savedTab = localStorage.getItem("eventsActiveTab") || "organized";
  const [activeTab, setActiveTab] = useState(savedTab);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isOrganizer = localStorage.getItem("userRole") === "organizer";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("eventsActiveTab", tab);
  };

  useEffect(() => {
    if (!isOrganizer && activeTab === "organized") {
      handleTabChange("invited");
    }
  }, [isOrganizer, activeTab]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "organized" ? "/events/organized" : "/events/invited";
      const res = await api.get(endpoint);
      const eventList = Array.isArray(res.data) ? res.data : [];
      setEvents(eventList);
    } catch (err) {
      toast.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const deleteEvent = async (event_id) => {
    if (!event_id || !window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${event_id}`);
      toast.success("Event deleted");
      setEvents(prev => prev.filter(e => e.event_id !== event_id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const inviteUser = async (event_id) => {
    const email = window.prompt("Enter email to invite:")?.trim();
    if (!email || !email.includes("@")) return toast.error("Invalid email");
    try {
      await api.post(`/events/${event_id}/invite`, { email });
      toast.success("Invitation sent");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite");
    }
  };

  const showAttendees = async (event_id) => {
    try {
      const res = await api.get(`/events/${event_id}/attendees`);
      const attendees = res.data || [];
      if (attendees.length === 0) return alert("No attendees yet");
      const list = attendees.map(a => `• ${a.user_email} — ${a.status || "Pending"}`).join("\n");
      alert(`Attendees (${attendees.length}):\n\n${list}`);
    } catch (err) {
      toast.error("Failed to load attendees");
    }
  };

  const handleNewEvent = (newEvent) => {
    if (newEvent) {
      setEvents(prev => [newEvent, ...prev]);
    }
  };

  if (loading) return <p className="text-center py-20 text-2xl">Loading events...</p>;

  return (
    <div className="relative">
      <div className="border-b-2 border-gray-200 mb-10">
        <div className="flex gap-12 max-w-2xl">
          {isOrganizer && (
            <button
              onClick={() => handleTabChange("organized")}
              className={`pb-4 px-2 text-lg font-bold border-b-4 transition-all duration-300 ${
                activeTab === "organized"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Organized Events
            </button>
          )}
          <button
            onClick={() => handleTabChange("invited")}
            className={`pb-4 px-2 text-lg font-bold border-b-4 transition-all duration-300 ${
              activeTab === "invited" || !isOrganizer
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Events I'm Invited To
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">{activeTab === "organized" ? "Briefcase" : "Party"}</div>
          <p className="text-2xl text-gray-600">
            {activeTab === "organized"
              ? "You haven't created any events yet"
              : "You haven't been invited to any events yet"}
          </p>
          {activeTab === "organized" && (
            <Button onClick={() => setModalOpen(true)} className="mt-8 text-xl px-10 py-4">
              + Create Your First Event
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    event.role === "organizer" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {event.role === "organizer" ? "Organizer" : "Attendee"}
                </span>
              </div>

              <div className="space-y-3 text-gray-600 mb-6">
                <p className="text-lg">Date: {event.date}</p>
                <p className="text-lg">Time: {event.time}</p>
                <p className="text-lg">Location: {event.location}</p>
                {event.description && <p className="italic pt-3 text-gray-700">{event.description}</p>}
              </div>

              {event.role === "attendee" && (
                <AttendanceResponse eventId={event.event_id} currentStatus={event.status} onUpdate={fetchEvents} />
              )}

              {event.role === "organizer" && (
                <div className="flex flex-wrap gap-3 mt-8">
                  <Button size="sm" variant="outline" onClick={() => inviteUser(event.event_id)}>
                    Invite
                  </Button>
                  <Button size="sm" onClick={() => showAttendees(event.event_id)}>
                    View Attendees
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.event_id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOrganizer && (
        <>
          <Button
            onClick={() => setModalOpen(true)}
            className="fixed bottom-8 right-8 rounded-full w-16 h-16 text-4xl shadow-2xl hover:scale-110 transition-all z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
          >
            +
          </Button>
          <CreateEventModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            onEventCreated={handleNewEvent}
          />
        </>
      )}
    </div>
  );
}