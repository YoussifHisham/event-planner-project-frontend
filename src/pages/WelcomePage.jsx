import Button from "../components/Button";

export default function WelcomePage({ user, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        <p className="mt-2 text-gray-700">You are logged in as:</p>
        <p className="mt-1 font-medium text-brand-dark">{user.user_email}</p>

        <Button onClick={onLogout} className="mt-6">
          Log Out
        </Button>
      </div>
    </div>
  );
}
