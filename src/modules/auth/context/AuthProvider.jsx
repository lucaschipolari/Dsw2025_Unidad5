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
    try {
      // 1. Filtrar confirmPassword
      const { confirmPassword: _confirmPassword, ...dataToSubmit } = formData;

      // 2. Registrar usuario
      const registerResponse = await register(dataToSubmit);

      if (!registerResponse.success) {
        return {
          success: false,
          status: registerResponse.status,
          message: registerResponse.message,
          errorCode: registerResponse.errorCode,
          data: null,
        };
      }

      // 3. Login automático
      const loginResponse = await login(formData.username, formData.password);

      if (!loginResponse.success) {
        return {
          success: false,
          status: loginResponse.status,
          message: loginResponse.message,
          errorCode: loginResponse.errorCode,
          data: null,
        };
      }

      // 4. Guardar token y decodificar
      localStorage.setItem('token', loginResponse.data.token);

      const decoded = jwtDecode(loginResponse.data.token);

      const newUser = {
        id: decoded.jti,
        username: decoded.sub,
        role: decoded.role,
        customerId: loginResponse.data.profile?.customerId,
        customerName: loginResponse.data.profile?.customerName,
        email: loginResponse.data.email,
      };

      setUser(newUser);
      setIsAuthenticated(true);

      return {
        success: true,
        status: 200,
        message: 'Registro e inicio de sesión exitoso',
        errorCode: null,
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          'Error de red. Servidor no responde.',
        errorCode: error.response?.data?.errorCode || null,
        data: null,
      };
    }
  };

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const singin = async (username, password) => {
    try {
      const response = await login(username, password);

      // Si el backend indica error
      if (!response.success) {
        return {
          success: false,
          status: response.status,
          message: response.message,
          errorCode: response.errorCode,
          data: null,
        };
      }

      // Guardar token
      localStorage.setItem('token', response.data.token);

      // Decodificar token
      const decoded = jwtDecode(response.data.token);

      const newUser = {
        id: decoded.jti,
        username: decoded.sub,
        role: decoded.role,
        customerId: response.data.profile?.customerId,
        customerName: response.data.profile?.customerName,
        email: response.data.email,
      };

      setUser(newUser);
      setIsAuthenticated(true);

      return {
        success: true,
        status: 200,
        message: 'Inicio de sesión exitoso',
        errorCode: null,
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          'Error de red. Servidor no responde.',
        errorCode: error.response?.data?.errorCode || null,
        data: null,
      };
    }
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
