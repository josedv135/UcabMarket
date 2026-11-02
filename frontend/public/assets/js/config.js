/**
 * Configuración central del cliente UcabMarket
 * Permite cambiar la URL del backend en un solo lugar.
 */
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  SOCKET_URL: 'http://localhost:3000',
  UPLOAD_URL: 'http://localhost:3000/uploads',
  TOKEN_KEY: 'ucabmarket_token',
  USER_KEY: 'ucabmarket_user',
};

// Congelar configuración para prevenir modificaciones accidentales
Object.freeze(CONFIG);
