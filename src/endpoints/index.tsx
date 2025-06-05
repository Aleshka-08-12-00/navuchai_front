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

    //Результат
    postResults: 'api/results',
    getResults: 'api/results',
    getResultsByUserId: (user_id: string | number | null): string => `api/results/user/${user_id}`,
    getResultByResultId: (result_id: string | number | null): string => `api/results/${result_id}`,

    //Пользователи
    getUserById: (user_id: string | number | null): string => `api/users/${user_id}`,
   
    //Статусы
    getTestStatuses: 'api/test-statuses',

    //Профиль
    getProfile: 'api/profile',
    putProfile: 'api/profile',
    putPassword: 'api/profile/password',

    //Группы пользователей
    getUserGroups: 'api/user-groups',
    postUserGroups: 'api/user-groups',
    getUserGroupsById: (id: string | number | null ): string => `api/user-groups/${id}`,

    //Пользователи
    getUsers: 'api/users',
    
  };
  
  export default endpoints;