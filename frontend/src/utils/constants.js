// frontend/src/utils/constants.js

// Checks if you are running locally (localhost) or on the web
const isLocal = window.location.hostname === "localhost";

// Switch automatically so you don't have to edit this file constantly
export const BASE_URL = isLocal 
  ? "http://localhost:7777/api" 
  : "https://devtinder-8i1r.onrender.com/api";
