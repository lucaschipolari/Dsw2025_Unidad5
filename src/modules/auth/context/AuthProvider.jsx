import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
      const decoded = jwtDecode(token);

      return {
        id: decoded.jti,
        username: decoded.sub,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  const signup = async (formData) => {
    const { confirmPassword: _confirmPassword, ...dataToSubmit } = formData;

    const { data, error } = await register(dataToSubmit);

    if (error) return { error };

    const { data: loginData, error: loginError } = await login(
      formData.username,
      formData.password,
    );

    if (loginError) return { error: loginError };

    localStorage.setItem('token', loginData.token);

    const decoded = jwtDecode(loginData.token);

    const newUser = {
      id: decoded.jti,
      username: decoded.sub,
      role: decoded.role,
    };

    setUser(newUser);
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

    if (error) return { error };

    localStorage.setItem('token', data.token);

    const decoded = jwtDecode(data.token);

    const newUser = {
      id: decoded.jti,
      username: decoded.sub,
      role: decoded.role,
      customerId: data.profile?.customerId,
      customerName: data.profile?.customerName,
      email: data.email,
    };

    setUser(newUser);
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        singin,
        singout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
