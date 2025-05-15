const endpoints = {
    //Тесты
    getTests: 'api/tests',
    postTests: 'api/tests',
    getTestsById: (id: string | number | null ): string => `api/tests/${id}`,
    putTestsById: (id: string | number | null ): string => `api/tests/${id}`,
    deleteTestsById: (id: string | number | null ): string => `api/tests/${id}`,

    //Авторизация 
    postAuth: 'auth/login',
    postRegistration: 'auth/register',

    //Категории
    getCategories: 'api/categories',
    postCategories: 'api/categories',

    //Языки
    getLocales: 'api/locales',

    //Логотип
    uploadLogo: 'api/files/upload',

    //Вопросы
    getQuestions: 'api/questions',
    postQuestions: 'api/questions',

  };
  
  export default endpoints;