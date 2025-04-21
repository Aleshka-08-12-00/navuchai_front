const endpoints = {
    //Тесты
    getTests: 'tests',
    postTests: 'tests',
    getTestsById: (id: string | number | null ): string => `tests/${id}`,
    putTestsById: (id: string | number | null ): string => `tests/${id}`,
    deleteTestsById: (id: string | number | null ): string => `tests/${id}`,

  };
  
  export default endpoints;