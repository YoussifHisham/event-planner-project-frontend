import { useState } from "react";
import MessageBox from "../components/MessageBox";
import Button from "../components/Button";
import Header from "../components/Header";
import { signup, login } from "../services/api";

export default function AuthPage({ onLogin }) {
  const [view, setView] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Header />
      {view === "login" ? (
        <LoginForm onShowSignup={() => setView("signup")} onLogin={onLogin} />
      ) : (
        <SignupForm onShowLogin={() => setView("login")} />
      )}
    </div>
  );
}
function LoginForm({ onShowSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const data = await login(email, password);
      if (!data.token) throw new Error(data.message || "Login failed");
      setMsg({ type: "success", text: "Login successful!" });
      onLogin(data.user, data.token);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Log in to your Account"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={submit}
      loading={loading}
      msg={msg}
      switchText="Don't have an account?"
      switchAction={onShowSignup}
      switchLabel="Sign Up"
    />
  );
}

// --- THIS IS THE MODIFIED FUNCTION ---
function SignupForm({ onShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const data = await signup(email, password);

      // --- MODIFICATION START ---
      // Check if the API response is a success OR if it's the specific
      // success message you saw (even if data.success is false)
      if (data.success || data.message === "User created successfully!") {
        setMsg({
          type: "success", // This will make MessageBox green
          text: data.message || "Signup successful! You can now log in.",
        });
        setEmail("");
        setPassword("");
      } else {
        // If it's any other message, treat it as an error
        throw new Error(data.message || "Signup failed");
      }
      // --- MODIFICATION END ---

    } catch (err) {
      setMsg({ type: "error", text: err.message }); // This will make MessageBox red
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create your Account"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={submit}
      loading={loading}
      msg={msg}
      switchText="Already have an account?"
      switchAction={onShowLogin}
      switchLabel="Log In"
    />
  );
}

function AuthForm({
  title,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  loading,
  msg,
  switchText,
  switchAction,
  switchLabel,
}) {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">{title}</h2>
      {/* This MessageBox will now correctly receive type="success" */}
      <MessageBox message={msg?.text} type={msg?.type} />

      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>

        <Button loading={loading}>
          {title.includes("Log") ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <p className="text-sm text-center text-gray-600">
        {switchText}{" "}
        <button
          type="button"
          onClick={switchAction}
          className="font-medium text-brand-dark hover:text-brand-accent"
        >
          {switchLabel}
        </button>
      </p>
    </div>
  );
}