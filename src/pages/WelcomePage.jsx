import { useAuth } from "../contexts/AuthContext"
// Import the new Navbar
import Navbar from "../components/Navbar"
import OrganizerDashboard from "../components/OrganizerDashboard"
import AttendeeDashboard from "../components/AttendeeDashboard"

export default function WelcomePage() {
  const { user } = useAuth()

  const isOrganizer = user?.role === "organizer"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isOrganizer ? <OrganizerDashboard /> : <AttendeeDashboard />}
      
    </div>
  )
}