// src/config.js

//  Detecta AUTOMÁTICAMENTE si estás en local o producción
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'                           //  Local
  : 'https://backendmangaspuertomontt.onrender.com';  //  Render
