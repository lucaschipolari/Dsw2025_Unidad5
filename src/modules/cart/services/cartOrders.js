import { instance } from "../../shared/api/axiosInstance";

export const postOrders = async (formData) => {
  try {
    const response = await instance.post("/api/orders", formData);

    // El backend devuelve algo como:
    // { success: true, data: {...}, message: "...", errorCode: null }
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      errorCode: response.data.errorCode,
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        data: null,
        message: error.response.data.message,
        errorCode: error.response.data.errorCode,
      };
    }

    return {
      success: false,
      data: null,
      message: "Error de red. Servidor no responde.",
      errorCode: null,
    };
  }
};
