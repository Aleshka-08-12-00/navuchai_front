import axios, { AxiosResponse, AxiosError } from 'axios';
import endpoints from '../endpoints';

// Базовый URL для API
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
// const BASE_URL = '/api-t'

// Типы для параметров
type Params = { [key: string]: string | number };

axios.defaults.withCredentials = false;


// Конструктор URL
const buildUrl = (endpointKey: string, params: Params = {}, dynamicParams: string | number | null = null): string => {
  let endpoint = endpoints[endpointKey as keyof typeof endpoints];
  console.log(params)
  // Обработка динамических endpoint
  if (typeof endpoint === 'function') {
    endpoint = endpoint(dynamicParams);
  }
  const url = new URL(`${BASE_URL}/${endpoint}`);
  console.log(url)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key].toString()));

console.log(url)
  return url.toString();
};

// Универсальная функция для проверки ответа
const validateResponse = (response: AxiosResponse) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`HTTP error! status: ${response.status}`);
};

// Универсальная функция для обработки ошибок
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Обработка 401 ошибки
      if (axiosError.response.status === 401) {
        window.location.replace('/login');
        throw new Error('Требуется авторизация');
      }
      // Пытаемся получить detail из ответа
      const responseData = axiosError.response.data;
      if (typeof responseData === 'object' && responseData !== null && 'detail' in responseData) {
        throw new Error(responseData.detail as string);
      }
      // Если нет detail, возвращаем стандартное сообщение об ошибке
      throw new Error(`Ошибка сервера: ${axiosError.response.status}`);
    } else if (axiosError.request) {
      throw new Error('Нет ответа от сервера');
    } else {
      throw new Error(`Ошибка запроса: ${axiosError.message}`);
    }
  }
  throw error;
};

// Универсальная функция для выполнения GET-запроса с возможностью передачи дополнительных опций
const fetchData = async (
  endpointKey: string,
  params: Params = {},
  dynamicParams: string | number | null = null,
  axiosConfig: Record<string, any> = {}
): Promise<any> => {
  const url = buildUrl(endpointKey, params, dynamicParams);
  try {
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
        ...axiosConfig.headers, // Позволяем переопределять заголовки при необходимости
      },
      ...axiosConfig, // Остальные опции axios
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


// Универсальная функция для выполнения POST-запроса
const postData = async (endpointKey: string, data: any, dynamicParams: string | number | null = null): Promise<any> => {
  const url = buildUrl(endpointKey, {}, dynamicParams);
  
  // Определяем, является ли data экземпляром FormData
  const isFormData = data instanceof FormData;
  
  // Настраиваем заголовки в зависимости от типа данных
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
  };

  // Добавляем Content-Type только если это не FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response: AxiosResponse = await axios.post(url, data, {
      headers,
      // Если это FormData, не преобразуем данные
      transformRequest: isFormData ? [(data) => data] : undefined
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const putData = async (endpointKey: string, data: any, dynamicParams: string | number | null = null): Promise<any> => {
  const url = buildUrl(endpointKey, {}, dynamicParams);
  try {
    const response: AxiosResponse = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const deleteData = async (endpointKey: string, params: Params = {}, dynamicParams: string | number | null = null): Promise<any> => {
  const url = buildUrl(endpointKey, params, dynamicParams);
  try {
    const response: AxiosResponse = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export { fetchData, postData, putData, deleteData }

export const getCourses   = () => fetchData('courses')
export const getCourse    = (id: number)                => fetchData('courseById', {}, id)
export const postCourse   = (data: any)                 => postData('courses', data)
export const putCourse    = (id: number, d: any)        => putData('courseById', d, id)
export const deleteCourse = (id: number)                => deleteData('courseById', {}, id)

export const getModules   = (courseId: number)          => fetchData('modulesByCourse', {}, courseId)
export const postModule   = (courseId: number, d: any)  => postData('modulesByCourse', d, courseId)
export const putModule    = (id: number, d: any)        => putData('moduleById', d, id)
export const deleteModule = (id: number)                => deleteData('moduleById', {}, id)

export const getLessons   = (moduleId: number)          => fetchData('lessonsByModule', {}, moduleId)
export const getLesson    = (id: number)                => fetchData('lessonById', {}, id)
export const postLesson   = (moduleId: number, d: any)  => postData('lessonsByModule', d, moduleId)
export const putLesson    = (id: number, d: any)        => putData('lessonById', d, id)
export const deleteLesson = (id: number)                => deleteData('lessonById', {}, id)

export const enrollCourse    = (courseId: number)                 => postData('courseEnroll', {}, courseId)
export const getUserCourses  = (userId: number)                   => fetchData('userCourses', {}, userId)

