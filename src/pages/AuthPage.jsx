import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [view, setView] = useState("login");
  const { login, register } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <Header />
      <div className="w-full max-w-xl mt-10">
        {view === "login" ? (
          <LoginForm onShowSignup={() => setView("signup")} login={login} />
        ) : (
          <SignupForm onShowLogin={() => setView("login")} register={register} />
        )}
      </div>
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
      toast.error("Login failed — wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Welcome Back
      </h2>

      <form onSubmit={submit} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none"
        />
        <Button loading={loading} className="w-full py-3 text-lg font-semibold">
          Log In
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onShowSignup}
          className="font-bold text-blue-600 hover:underline"
        >
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
      toast.success(
        `Welcome! You're now registered as ${
          role === "organizer" ? "an Organizer" : "an Attendee"
        }`
      );
    } catch {
      toast.error("Email already taken or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Create an Account
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Choose your role & start using Evently
      </p>

      <form onSubmit={submit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <label
            className={`cursor-pointer rounded-2xl p-6 border transition-all ${
              role === "attendee"
                ? "border-blue-500 shadow-lg bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="attendee"
              checked={role === "attendee"}
              onChange={(e) => setRole(e.target.value)}
              className="sr-only"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                I'm an Attendee
              </h3>
              <p className="text-gray-600 text-sm">
                Join and participate in events
              </p>
            </div>
          </label>

          <label
            className={`cursor-pointer rounded-2xl p-6 border transition-all ${
              role === "organizer"
                ? "border-cyan-500 shadow-lg bg-cyan-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="organizer"
              checked={role === "organizer"}
              onChange={(e) => setRole(e.target.value)}
              className="sr-only"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                I'm an Organizer
              </h3>
              <p className="text-gray-600 text-sm">
                Create and manage events
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Choose a Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>

        <Button
          loading={loading}
          className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Create Account as {role === "organizer" ? "Organizer" : "Attendee"}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onShowLogin}
          className="font-bold text-blue-600 hover:underline"
        >
          Log In
        </button>
      </p>
    </div>
  );
}