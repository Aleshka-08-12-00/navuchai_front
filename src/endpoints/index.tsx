const endpoints = {
  //Тесты
  getTests: 'api/tests/my',
  postTests: 'api/tests',
  getTestsById: (id: string | number | null): string => `api/tests/${id}`,
  putTestsById: (id: string | number | null): string => `api/tests/${id}`,
  deleteTestsById: (id: string | number | null): string => `api/tests/${id}`,

  //Авторизация 
  postAuth: 'auth/login',
  postRegistration: 'auth/register',
  getAuthMe: 'auth/me',
  postRefreshToken: 'auth/refresh',

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
  getQuestionsById: (id: string | number | null): string => `api/questions/by-test/${id}`,
  putQuestionsById: (id: string | number | null): string => `api/questions/${id}`,
  getQuestionsByIdById: (id: string | number | null): string => `api/questions/${id}`,
  deleteQuestionsById: (id: string | number | null): string => `api/questions/${id}`,
  postQuestionsToTest: (question_id: string | number | null, test_id: string | number | null): string => `api/questions/${question_id}/add-to-test/${test_id}`,
  getQuestionsByTestId: (testId: string | number | null): string => `api/questions/by-test/${testId}`,
  getQuestionsByTestIdPublic: (testId: string | number | null): string => `api/questions/by-test/${testId}/public`,
 
  //Типы вопросов
  getQuestionsTypes: 'api/question-types',
  
  //Результат
  postResults: 'api/results',
  getResults: 'api/results',
  getResultsByUserId: (user_id: string | number | null): string => `api/results/user/${user_id}`,
  getResultByResultId: (result_id: string | number | null): string => `api/results/${result_id}`,
  exportResultsExcel: 'api/results/excel',

  //Пользователи
  getUserById: (user_id: string | number | null): string => `api/users/${user_id}`,

  //Статусы
  getTestStatuses: 'api/test-statuses',

  //Профиль
  getProfile: 'api/profile',
  putProfile: 'api/profile',
  putPassword: 'api/profile/password',

  //Доступ к тестам
  postGroupToTest: 'api/test-access/group',
  postUserToTest: 'api/test-access/user',
  getGroupsInTest: (test_id: string | number | null): string => `api/test-access/${test_id}/groups`,
  getUsersInTest: (test_id: string | number | null): string => `api/test-access/${test_id}/users`,
  deleteUserInTest: (params: string | number | null): string => `api/test-access/user/${params}`,
  deleteGroupInTest: (params: string | number | null): string => `api/test-access/group/${params}`,


  //Группы пользователей
  getUserGroups: 'api/user-groups',
  postUserGroups: 'api/user-groups',
  getUserGroupsById: (id: string | number | null): string => `api/user-groups/${id}`,
  putUserGroupsById: (id: string | number | null): string => `api/user-groups/${id}`,
  deleteUserGroupsById: (id: string | number | null): string => `api/user-groups/${id}`,

  //Пользователи
  getUsers: 'api/users',
  putUserRoleById: (id: string | number | null): string => `api/users/${id}/role`,
  deleteUserById: (id: string | number | null): string => `api/users/${id}`,

  //Роли пользователей
  getRoles: 'api/roles',

  /* КУРСЫ */
  courses: 'api/courses',                                   // GET list, POST create
  courseById: (id: string | number) => `api/courses/${id}`,          // GET/PUT/DELETE
  modulesByCourse: (courseId: string | number) => `api/courses/${courseId}/modules`,

  /* МОДУЛИ */
  modules: 'api/modules',                              // POST если нужен «глобальный» create
  moduleById: (id: string | number) => `api/modules/${id}`,

  /* УРОКИ */
  lessons: 'api/lessons',
  lessonById: (id: string | number) => `api/lessons/${id}`,
  lessonsByModule: (moduleId: string | number) => `api/modules/${moduleId}/lessons`,

  // Доступ и прогресс курсов
  enrollCourse: (courseId: string | number) => `api/courses/${courseId}/enroll`,
  enrollCourseAdmin: (courseId: string | number, userId: string | number) =>
    `api/courses/${courseId}/enroll/${userId}`,
  userCourses: (userId: string | number) => `api/courses/users/${userId}/courses`,
  courseProgress: (courseId: string | number) => `api/courses/${courseId}/progress`,
  courseTests: (courseId: string | number) => `api/courses/${courseId}/tests`,

  moduleProgress: (moduleId: string | number) => `api/modules/${moduleId}/progress`,
  moduleTests: (moduleId: string | number) => `api/modules/${moduleId}/tests`,

  lessonComplete: (lessonId: string | number) => `api/lessons/${lessonId}/complete`,
};

export default endpoints;


