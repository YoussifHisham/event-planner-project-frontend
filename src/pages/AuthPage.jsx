import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [view, setView] = useState("login");
  const { login, register } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <Header />
      {view === "login" ? (
        <LoginForm onShowSignup={() => setView("signup")} login={login} />
      ) : (
        <SignupForm onShowLogin={() => setView("login")} register={register} />
      )}
    </div>
  );
}

function LoginForm({ onShowSignup, login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      toast.error("Login failed – wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Welcome Back!</h2>
      
      <form onSubmit={submit} className="space-y-6">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:border-transparent text-lg" />
        
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:border-transparent text-lg" />
        
        <Button loading={loading} className="w-full text-xl py-5 font-bold">
          Log In
        </Button>
      </form>

      <p className="text-center mt-8 text-gray-600">
        Don't have an account?{" "}
        <button onClick={onShowSignup} className="font-bold text-blue-600 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}

function SignupForm({ onShowLogin, register }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, role);
      toast.success(`Welcome! You're now registered as ${role === "organizer" ? "an Organizer" : "an Attendee"}`);
    } catch {
      toast.error("Email already taken or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-10 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Join Evently</h2>
      <p className="text-center text-gray-600 mb-10">Choose how you want to use the app</p>

      <form onSubmit={submit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Attendee Card */}
          <label className={`relative cursor-pointer rounded-2xl border-4 p-8 transition-all ${role === "attendee" ? "border-blue-500 shadow-2xl scale-105" : "border-gray-200 hover:border-gray-400"}`}>
            <input type="radio" name="role" value="attendee" checked={role === "attendee"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
            <div className="text-center">
              <div className="text-6xl mb-4">Party</div>
              <h3 className="text-2xl font-bold mb-2">I'm an Attendee</h3>
              <p className="text-gray-600">Join events, RSVP, and have fun!</p>
            </div>
          </label>

          {/* Organizer Card */}
          <label className={`relative cursor-pointer rounded-2xl border-4 p-8 transition-all ${role === "organizer" ? "border-purple-500 shadow-2xl scale-105" : "border-gray-200 hover:border-gray-400"}`}>
            <input type="radio" name="role" value="organizer" checked={role === "organizer"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
            <div className="text-center">
              <div className="text-6xl mb-4">Calendar</div>
              <h3 className="text-2xl font-bold mb-2">I'm an Organizer</h3>
              <p className="text-gray-600">Create events, invite people, manage everything</p>
            </div>
          </label>
        </div>

        <div className="space-y-6">
          <input type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-300 focus:border-transparent text-lg" />
          
          <input type="password" placeholder="Choose a Password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-300 focus:border-transparent text-lg" />
        </div>

        <Button loading={loading} className="w-full text-xl py-5 font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Create Account as {role === "organizer" ? "Organizer" : "Attendee"}
        </Button>
      </form>

      <p className="text-center mt-8 text-gray-600">
        Already have an account?{" "}
        <button onClick={onShowLogin} className="font-bold text-purple-600 hover:underline">
          Log In
        </button>
      </p>
    </div>
  );
}