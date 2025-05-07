
import axios from "axios";
axios.defaults.withCredentials = false;
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const $api = axios.create({
  baseURL: API_URL,
  timeout: 60000, 
  headers: {
    Authorization: `Bearer ${localStorage.getItem('tokenNavuchai')}`
  }
});

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Неавторизованный доступ");
    } else if (error.response && error.response.status === 403) {
      console.error("Доступ запрещен");
    } else if (error.response && error.response.status === 404) {
      console.error("Ресурс не найден");
    } else if (error.response && error.response.status >= 500) {
      console.error("Ошибка сервера");
    }
    return Promise.reject(error);
  }
);

export default $api;