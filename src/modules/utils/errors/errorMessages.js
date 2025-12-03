// src/utils/errorMessages.js
export const errorMessages = {
  // 1000 – Errores genéricos
  1000: 'Ha ocurrido un error desconocido.',
  1001: 'Los datos enviados son inválidos.',

  // 2000 – Usuarios
  2000: 'El usuario no fue encontrado.',
  2001: 'El usuario está deshabilitado.',

  // 3000 – Productos
  3000: 'El producto no fue encontrado.',
  3001: 'Stock insuficiente para el producto.',
  3002: 'Ya existe un producto con el mismo SKU.',
  3003: 'No se encontraron productos.',

  // 4000 – Pedidos
  4000: 'El pedido no fue encontrado.',
  4001: 'El estado del pedido es inválido.',

  // 5000 – Autenticación / Autorización
  5000: 'No autorizado.',
  5001: 'El token es inválido o ha expirado.',

  // 6000 – Base de datos
  6000: 'Error en la base de datos.',

  7000: 'El usuario ya existe en el sistema.',
  7001: 'El email ya está registrado por otro usuario.',
  7002: 'El rol especificado no existe.',
};
