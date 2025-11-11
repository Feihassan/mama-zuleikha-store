import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('token'));

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` },
          credentials: 'include'
        });
      }
    } catch {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    }
  }, [accessToken]);

  const checkAuth = useCallback(async () => {
    try {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const refreshToken = async () => {
    logout();
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        toast.success('Login successful!');
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const adminLogin = async (email, password, isCreate = false, name = '') => {
    try {
      const endpoint = isCreate ? '/api/auth/admin/create' : '/api/auth/admin/login';
      const body = isCreate ? { name, email, password } : { email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        toast.success(isCreate ? 'Admin account created!' : 'Admin login successful!');
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Admin operation failed. Please try again.' };
    }
  };


  const hasRole = (role) => user?.role === role;

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (!accessToken) return {};
    return { 'Authorization': `Bearer ${accessToken}` };
  };

  const value = {
    user,
    loading,
    accessToken,
    login,
    adminLogin,
    logout,
    hasRole,
    refreshToken,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};