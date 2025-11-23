import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const signup = async (formData) => {
    const { confirmPassword: _confirmPassword, ...dataToSubmit } = formData;

    const { data, error } = await register(dataToSubmit);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);

    return { error: null };
  };

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        user,
        singin,
        singout,
        signup,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};