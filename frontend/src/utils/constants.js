// frontend/src/utils/constants.js

// Check if the browser is running on localhost
const isLocal = window.location.hostname === "localhost";

// If local, use local backend (Port 7777). If prod, use Render.
// NOTE: We include "/api" here so we don't have to add it in every component.
export const BASE_URL = isLocal 
  ? "http://localhost:7777/api" 
  : "https://devtinder-8i1r.onrender.com/api";
