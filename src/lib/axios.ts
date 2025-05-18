import axios from "axios";

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: { "Content-Type": "application/json" },
  timeout: 900000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    // For example, add an authentication token to the headers
    // const token = localStorage.getItem("authToken"); // Retrieve auth token from localStorage
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  function (error) {
    // Handle the error
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
    function (response) {
      // Do something with the response data
    //   console.log('Response:', response);
      return response;
    },
    function (error) {
      // Handle the response error
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized, logging out...');
        // Perform any logout actions or redirect to login page
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
