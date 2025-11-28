import EventsSection from "./EventsSection";

export default function AttendeeDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
      </div>

      <EventsSection />
    </div>
  );
}