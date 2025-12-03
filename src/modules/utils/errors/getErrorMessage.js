// src/utils/getErrorMessage.js
import { errorMessages } from './errorMessages';

export function getErrorMessage(errorCode, defaultMessage) {
  return errorMessages[errorCode] || defaultMessage || 'Error inesperado.';
}
