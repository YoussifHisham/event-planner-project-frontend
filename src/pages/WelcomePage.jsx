import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import CreateEventModal from "../components/CreateEventModal"
import EventsSection from "../components/EventsSection"

export default function WelcomePage() {
  const { user, logout } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)

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
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button onClick={logout} variant="outline">
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              + Create New Event
            </Button>
          </div>

          <EventsSection />
        </div>
      </div>

      <CreateEventModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </>
  )
}