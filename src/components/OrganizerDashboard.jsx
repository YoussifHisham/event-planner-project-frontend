import { useState } from "react";
import Button from "./Button";
import CreateEventModal from "./CreateEventModal";
import EventsSection from "./EventsSection";

export default function OrganizerDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-900">My Events</h2>

        <button 
            onClick={() => setShowCreateModal(true)} 
            size="lg"
            className="px-6 py-2 font-medium text-white rounded-md shadow-sm
                        bg-green-600 hover:bg-green-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-green-500 transition-all"
            >
            + Create New Event
            </button>
      </div>

      <EventsSection />
      <CreateEventModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}