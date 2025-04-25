import axios, { AxiosResponse } from 'axios';
import endpoints from '../endpoints';

// Базовый URL для API
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Типы для параметров
type Params = { [key: string]: string | number };

axios.defaults.withCredentials = false;


// Конструктор URL
const buildUrl = (endpointKey: string, params: Params = {}, dynamicParams: string | number | null = null): string => {
  let endpoint = endpoints[endpointKey as keyof typeof endpoints];
  
  // Обработка динамических endpoint
  if (typeof endpoint === 'function') {
    endpoint = endpoint(dynamicParams);
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key].toString()));
  return url.toString();
};

// Универсальная функция для выполнения GET-запроса
const fetchData = async (endpointKey: string, params: Params = {}, dynamicParams: string | number | null = null): Promise<| undefined> => {
  const url = buildUrl(endpointKey, params, dynamicParams);
  try {
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    console.log('Данные получены:', response.data);
    return response.data;
  } catch (error) {
    console.error('Произошла ошибка при выполнении запроса:', error);
  }
};

// Универсальная функция для выполнения POST-запроса
const postData = async (endpointKey: string, data: any, dynamicParams: string | number | null = null): Promise< | undefined> => {
  const url = buildUrl(endpointKey, {}, dynamicParams);
  try {
    const response: AxiosResponse = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
      }
    });
    console.log('Данные отправлены и получен ответ:', response.data);
    return response.data;
  } catch (error: unknown) {
    //@ts-ignore
    return error as Error; // Cast error to Error type
  }
};

const putData = async (endpointKey: string, data: any, dynamicParams: string | number | null = null): Promise< | undefined> => {
    const url = buildUrl(endpointKey, {}, dynamicParams);
    try {
      const response: AxiosResponse = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
        }
      });
      console.log('Данные отправлены и получен ответ:', response.data);
      return response.data;
    } catch (error) {
      console.error('Произошла ошибка при отправке данных:', error);
    }
  };

  const deleteData = async (endpointKey: string, params: Params = {}, dynamicParams: string | number | null = null): Promise< | undefined> => {
    const url = buildUrl(endpointKey, params, dynamicParams);
    try {
      const response: AxiosResponse = await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`
        }
      });
      console.log('Данные отправлены и получен ответ:', response.data);
      return response.data;
    } catch (error) {
      console.error('Произошла ошибка при отправке данных:', error);
    }
  };

export { fetchData, postData, putData, deleteData }
