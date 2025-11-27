import { useState } from "react";
import MessageBox from "../components/MessageBox";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";   
import toast from "react-hot-toast";                 

export default function AuthPage() {
  const [view, setView] = useState("login");
  const { login, register } = useAuth();         

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Header />
      {view === "login" ? (
        <LoginForm onShowSignup={() => setView("signup")} />
      ) : (
        <SignupForm onShowLogin={() => setView("login")} />
      )}
    </div>
  );
}

function LoginForm({ onShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    
    } catch (err) {
      toast.error("Login failed – wrong email or password");
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
      switchText="Don't have an account?"
      switchAction={onShowSignup}
      switchLabel="Sign Up"
    />
  );
}
function SignupForm({ onShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      toast.success("Account created! You are now logged in");
    } catch (err) {
      toast.error("Signup failed – maybe this email is already taken");
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
  switchText,
  switchAction,
  switchLabel,
}) {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">{title}</h2>

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