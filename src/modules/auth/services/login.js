import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('/api/auth/login', {
      username,
      password,
    });

    return {
      success: response.data.success,
      status: response.status,
      message: response.data.message,
      errorCode: response.data.errorCode,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message,
        errorCode: error.response.data.errorCode,
        data: null,
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Error de red. Servidor no responde.',
      errorCode: null,
      data: null,
    };
  }
};
