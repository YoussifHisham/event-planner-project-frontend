import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./Button";

export default function CreateEventModal({ open, onOpenChange, onEventCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/events", formData);
      // Now we get the full event directly
      toast.success("Event created successfully!");
      onOpenChange(false);
      onEventCreated?.(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" type="text" placeholder="Event Title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <input name="date" type="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <input name="time" type="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <input name="location" type="text" placeholder="Location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg resize-none" />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1">
              Create Event
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}