import { instance } from '../../shared/api/axiosInstance';

export const register = async (formData) => {
  try {
    const response = await instance.post('/api/auth/register', formData);

    return { data: response.data.data, error: null };

  } catch (error) {
    if (error.response && error.response.data.data) {
      return { data: null, error: error.response.data.data };
    }

    return { data: null, error: { message: 'Error de red. Servidor no responde.' } };
  }
};