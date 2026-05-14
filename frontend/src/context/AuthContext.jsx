import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, signupUser as apiSignup, getProfile } from '../services/api';

const AuthContext = createContext(null);

// Normalize user object — login returns `id`, profile returns `_id`
function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    _id: u._id || u.id,
    id: u.id || u._id,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tf_token');
    if (token) {
      getProfile()
        .then((res) => {
          const u = normalizeUser(res.data.user);
          setUser(u);
          localStorage.setItem('tf_user', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('tf_token');
          localStorage.removeItem('tf_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    const { token, user: u } = res.data;
    const normalized = normalizeUser(u);
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const signup = async (name, email, password, role) => {
    const res = await apiSignup({ name, email, password, role });
    const { token, user: u } = res.data;
    const normalized = normalizeUser(u);
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const logout = () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
