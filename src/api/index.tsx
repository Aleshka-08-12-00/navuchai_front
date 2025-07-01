import axios, { AxiosResponse, AxiosError } from 'axios';
import endpoints from '../endpoints';

// Базовый URL для API
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
// const BASE_URL = '/api-t'

// Типы для параметров
type Params = { [key: string]: string | number };

// Тип для динамических параметров в endpoint
type DynamicParams = string | number | Array<string | number> | null;

axios.defaults.withCredentials = false;

// Конструктор URL
const buildUrl = (
  endpointKey: string,
  params: Params = {},
  dynamicParams: DynamicParams = null,
): string => {
  let endpoint = endpoints[endpointKey as keyof typeof endpoints];
  // Обработка динамических endpoint
  if (typeof endpoint === 'function') {
    if (Array.isArray(dynamicParams)) {
      endpoint = endpoint(...dynamicParams);
    } else {
      endpoint = endpoint(dynamicParams);
    }
  }
  const url = new URL(`${BASE_URL}/${endpoint}`);

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key].toString()));

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
const handleError = async (error: unknown, originalRequest?: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Обработка 401 ошибки
      const responseData = axiosError.response.data;
      if (
        axiosError.response.status === 401 &&
        typeof responseData === 'object' &&
        responseData !== null &&
        'detail' in responseData &&
        responseData.detail === 'Неверный токен'
      ) {
        // Попытка обновить токен
        try {
          await refreshToken();
          // Повторяем исходный запрос с новым токеном
          if (originalRequest) {
            originalRequest.headers = {
              ...originalRequest.headers,
              'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
            };
            const retryResponse = await axios.request(originalRequest);
            return validateResponse(retryResponse);
          }
        } catch (refreshError) {
          window.location.replace('/login');
          throw new Error('Требуется авторизация');
        }
      }
      // Пытаемся получить detail из ответа
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

// Функция для обновления токена
const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refreshTokenNavuchai');
  if (!refresh_token) throw new Error('Нет refresh токена');
  const url = buildUrl('postRefreshToken');
  const response = await axios.post(url, { refresh_token });
  if (response.status >= 200 && response.status < 300) {
    const { access_token, refresh_token } = response.data;
    if (access_token) localStorage.setItem('tokenNavuchai', access_token);
    if (refresh_token) localStorage.setItem('refreshTokenNavuchai', refresh_token);
    return response.data;
  }
  throw new Error('Не удалось обновить токен');
};

// Универсальная функция для выполнения GET-запроса с возможностью передачи дополнительных опций
const fetchData = async (
  endpointKey: string,
  params: Params = {},
  dynamicParams: DynamicParams = null,
  axiosConfig: Record<string, any> = {}
): Promise<any> => {
  const url = buildUrl(endpointKey, params, dynamicParams);
  try {
    console.log(url)
    console.log(localStorage.getItem('tokenNavuchai'))
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokenNavuchai')}`,
        ...axiosConfig.headers // Позволяем переопределять заголовки при необходимости
      },
      ...axiosConfig // Остальные опции axios
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error, {
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
        ...axiosConfig.headers,
      },
      ...axiosConfig,
    });
  }
};

// Универсальная функция для выполнения POST-запроса
const postData = async (
  endpointKey: string,
  data: any,
  dynamicParams: DynamicParams = null,
): Promise<any> => {
  const url = buildUrl(endpointKey, {}, dynamicParams);

  // Определяем, является ли data экземпляром FormData
  const isFormData = data instanceof FormData;

  // Настраиваем заголовки в зависимости от типа данных
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem('tokenNavuchai')}`
  };
  // Добавляем Content-Type только если это не FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  try {
    const response: AxiosResponse = await axios.post(url, data, {
      headers,
      transformRequest: isFormData ? [(data) => data] : undefined
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error, {
      method: 'post',
      url,
      data,
      headers,
      transformRequest: isFormData ? [(data: any) => data] : undefined
    });
  }
};

const putData = async (
  endpointKey: string,
  data: any,
  dynamicParams: DynamicParams = null,
): Promise<any> => {
  const url = buildUrl(endpointKey, {}, dynamicParams);
  try {
    const response: AxiosResponse = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error, {
      method: 'put',
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
  }
};

const deleteData = async (
  endpointKey: string,
  params: Params = {},
  dynamicParams: DynamicParams = null,
): Promise<any> => {
  const url = buildUrl(endpointKey, params, dynamicParams);
  try {
    const response: AxiosResponse = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    return validateResponse(response);
  } catch (error) {
    return handleError(error, {
      method: 'delete',
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
  }
};

export { fetchData, postData, putData, deleteData };

export const getCourses = () => fetchData('courses');
export const postCourse = (data: any) => postData('courses', data);
export const putCourse = (id: number, d: any) => putData('courseById', d, id);
export const deleteCourse = (id: number) => deleteData('courseById', {}, id);
export const getCourse = (id: number) => fetchData('courseById', {}, id);

export const getModules = (courseId: number) => fetchData('modulesByCourse', {}, courseId);
export const postModule = (courseId: number, d: any) => postData('modulesByCourse', d, courseId);
export const putModule = (id: number, d: any) => putData('moduleById', d, id);
export const deleteModule = (id: number) => deleteData('moduleById', {}, id);

export const getLessons = (moduleId: number) => fetchData('lessonsByModule', {}, moduleId);
export const getLesson = (id: number) => fetchData('lessonById', {}, id);
export const postLesson = (moduleId: number, d: any) => postData('lessonsByModule', d, moduleId);
export const putLesson = (id: number, d: any) => putData('lessonById', d, id);
export const deleteLesson = (id: number) => deleteData('lessonById', {}, id);

export const enrollCourse = (courseId: number) => postData('enrollCourse', {}, courseId);
export const enrollCourseAdmin = (courseId: number, userId: number) =>
  postData('enrollCourseAdmin', {}, [courseId, userId]);
export const getUserCourses = (userId: number) => fetchData('userCourses', {}, userId);
export const getCourseProgress = (courseId: number) => fetchData('courseProgress', {}, courseId);
export const getCourseTests = (courseId: number) => fetchData('courseTests', {}, courseId);
export const postCourseTest = (courseId: number, d: any) => postData('courseTests', d, courseId);
export const getModuleProgress = (moduleId: number) => fetchData('moduleProgress', {}, moduleId);
export const getModuleTests = (moduleId: number) => fetchData('moduleTests', {}, moduleId);
export const postModuleTest = (moduleId: number, d: any) => postData('moduleTests', d, moduleId);
export const completeLesson = (lessonId: number) => postData('lessonComplete', {}, lessonId);

export const getTestImportTemplate = () => fetchData('getTestImportTemplate');
export const postTestImportExcel = (formData: FormData) => postData('postTestImportExcel', formData);
