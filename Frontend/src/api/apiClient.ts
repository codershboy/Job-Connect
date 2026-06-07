import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot Backend port
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle authentication/signature failures (auto logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userTitle");
      localStorage.removeItem("userSkills");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
