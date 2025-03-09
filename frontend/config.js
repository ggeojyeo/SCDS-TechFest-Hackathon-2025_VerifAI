const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://your-deployed-backend.com" // Production backend URL
        : "http://localhost:5000"; // Local development backend

export default API_BASE_URL;
