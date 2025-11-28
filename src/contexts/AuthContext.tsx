import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: "organizer" | "attendee";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: "organizer" | "attendee") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userData = {
          id: payload.userId || payload.id,
          email: payload.email || payload.user_email,
          role: payload.role || "attendee"
        };
        setUser(userData);
        localStorage.setItem("userRole", userData.role);
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);

    const userData = res.data.user || {};
    const role = userData.role || "attendee";
    const loggedUser = {
      id: userData.user_id || userData.id,
      email: userData.user_email || userData.email,
      role
    };

    setUser(loggedUser);
    localStorage.setItem("userRole", role);

    toast.success('Welcome back!');
    navigate('/welcome');
  };

  const register = async (email: string, password: string, role: "organizer" | "attendee" = "attendee") => {
    const res = await api.post('/auth/signup', { email, password, role });
    localStorage.setItem('token', res.data.token);

    const userData = res.data.user || {};
    const finalRole = userData.role || role;
    const newUser = {
      id: userData.user_id,
      email: userData.user_email,
      role: finalRole
    };

    setUser(newUser);
    localStorage.setItem("userRole", finalRole);

    toast.success(`Welcome, ${finalRole}!`);
    navigate('/welcome');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    toast.success('Logged out');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};