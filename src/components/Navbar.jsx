import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  
  const isOrganizer = user?.role === "organizer";

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          {/* 1. Event Planner Text -> Navigates to Home */}
          <a href="/" className="text-2xl font-bold text-gray-900 hover:text-brand-accent transition-colors">
            Event Planner
          </a>
          
          <a href="/search" className="text-brand-accent hover:underline font-medium">
            Search Events
          </a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>

                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  isOrganizer ? "bg-purple-600" : "bg-blue-600"
                }`}>
                  {isOrganizer ? "Organizer" : "Attendee"}
                </span>
              </div>

              <Button onClick={logout} variant="outline" size="sm">
                Log Out
              </Button>
            </>
          ) : (
            // Fallback if no user is logged in (optional, for safety)
            <a href="/" className="text-sm font-medium text-brand-accent">Log In</a>
          )}
        </div>
      </div>
    </div>
  );
}