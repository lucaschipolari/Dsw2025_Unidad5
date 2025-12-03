import { instance } from '../../shared/api/axiosInstance';

export const postOrders = async (formData) => {
  try {
    const response = await instance.post('/api/orders', formData);

    return { data: response.data.data, error: null };

  } catch (error) {
    if (error.response && error.response.data.data) {
      return { data: null, error: error.response.data.data };
    }

    return { data: null, error: { message: 'Error de red. Servidor no responde.' } };
  }
};