import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import CreateEventModal from "../components/CreateEventModal"
import EventsSection from "../components/EventsSection"

export default function WelcomePage() {
  const { user, logout } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)

  // لو اليوزر organizer → يشوف زرار الـ Create
  const isOrganizer = user?.role === "organizer"

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">Event Planner</h1>
              <a href="/search" className="text-brand-accent hover:underline font-medium">
                Search Events
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.email}</span>

                {/* Badge يوضح الدور */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  isOrganizer ? "bg-purple-600" : "bg-blue-600"
                }`}>
                  {isOrganizer ? "Organizer" : "Attendee"}
                </span>
              </div>

              <Button onClick={logout} variant="outline" size="sm">
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Events</h2>

            {/* زرار Create بس للـ Organizer */}
            {isOrganizer && (
              <Button 
                onClick={() => setShowCreateModal(true)} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                + Create New Event
              </Button>
            )}
          </div>

          <EventsSection />
        </div>
      </div>

      {/* Modal بس للـ Organizer */}
      {isOrganizer && (
        <CreateEventModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal}
        />
      )}
    </>
  )
}