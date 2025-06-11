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
    getAuthMe: 'auth/me',

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
    getQuestionsById: (id: string | number | null ): string => `api/questions/by-test/${id}`,
    postQuestionsToTest: (question_id: string | number | null , test_id: string | number | null): string => `api/questions/${question_id}/add-to-test/${test_id}`,
    getQuestionsByTestId: (testId: string | number | null): string => `api/questions/by-test/${testId}`,

    //Статусы
    getTestStatuses: 'api/test-statuses',

  /* КУРСЫ */
  courses: 'api/courses',                                   // GET list, POST create
  courseById:    (id: string | number) => `api/courses/${id}`,          // GET/PUT/DELETE
  modulesByCourse: (courseId: string | number) => `api/courses/${courseId}/modules`,

  /* МОДУЛИ */
  modules:      'api/modules',                              // POST если нужен «глобальный» create
  moduleById:   (id: string | number) => `api/modules/${id}`,

  /* УРОКИ */
  lessons:      'api/lessons',
  lessonById:   (id: string | number) => `api/lessons/${id}`,
  lessonsByModule: (moduleId: string | number) => `api/modules/${moduleId}/lessons`,
  };
  
  export default endpoints;
