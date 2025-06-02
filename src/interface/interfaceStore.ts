export interface InterfaceTests {
  id: number;
  title: string;
  description: string;
  category_id: number;
  creator_id: number;
  access_timestamp: string;
  status_id: number;
  frozen: boolean;
  locale_id: number;
  time_limit: number;
  img_id: null | number;
  category_name: string;
  creator_name: string;
  locale_code: string;
  status_name: string;
  image: null | {
    type: string;
    name: string;
    size: number;
    path: string;
    provider: string;
    creator_id: number;
    id: number;
    created_at: string;
    updated_at: string;
  };
  percent?: number;
  completed?: number;
  status_name_ru?: string;
  status_color?: string;
}

export interface IPostTest {
  title: string;
  description: string;
  category_id: number;
  creator_id: number;
  access_timestamp: string;
  status: string;
  status_id: number;
  status_name: string;
  status_name_ru: string;
  status_color: string;
  frozen: boolean;
  locale_id: number;
  time_limit: number;
  img_id: number;
}

export interface IRegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

export interface IAuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role_id: number;
  role_code: string;
  role_name: string;
}

export interface ILoginUser {
  grant_type: string;
  username: string;
  password: string;
}

export interface ITestCategories {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface IGroupMember {
  id: number;
  email: string;
  send_code: boolean;
}

export interface ILocales {
  code: string;
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface IQuestions {
  id: number;
  text: string;
  text_abstract: string;
  type: string;
  reviewable: boolean;
  answers: {
    correctAnswer: string[];
    allAnswer: string[];
    settings: {
      correctScore: number;
      incorrectScore: number;
      showMaxScore: boolean;
      requireAnswer: boolean;
      stopIfIncorrect: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface IPostQuestion {
  text: string;
  text_abstract: string;
  type: string;
  reviewable: boolean;
  answers: {
    correctAnswer: string[];
    allAnswer: string[];
    settings: {
      correctScore: number;
      incorrectScore: number;
      showMaxScore: boolean;
      requireAnswer: boolean;
      stopIfIncorrect: boolean;
    };
  };
}

export interface IQuestionInTest {
  question: {
    id: number;
    text: string;
    text_abstract: string;
    type: string;
    reviewable: boolean;
    answers: {
      settings: {
        correctScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        incorrectScore: number;
        stopIfIncorrect: boolean;
      };
      allAnswer: string[];
      correctAnswer: string[];
    };
    created_at: string;
    updated_at: string;
  };
  position: number;
  required: boolean;
  max_score: number;
}

export interface ITestStatus {
  name: string;
  code: string;
  name_ru: string;
  color: string;
  id: number;
  created_at: string;
  updated_at: string;
}

// // ---------- результат теста ----------
// /**
//  * Тип значения ответа на вопрос
//  */
// export interface ITestResultAnswerPayload {
//   value: string | number | boolean | string[] | number[] | Record<string, any>;
// }

// /**
//  * Массив ответов
//  */
// export interface ITestResultAnswerRequest {
//   question_id: number;
//   answer: ITestResultAnswerPayload;
// }

// /**
//  * Тело POST-запроса для создания результата теста
//  */
// export interface ITestResultCreateRequest {
//   test_id: number;
//   user_id?: number;
//   score: number;
//   completed_at?: string;
//   created_at?: string;
//   updated_at?: string;
//   answers: ITestResultAnswerRequest[];
// }

// /**
//  * Ответ сервера по каждому ответу на вопрос.
//  */
// export interface ITestResultAnswerResponse {
//   id: number;
//   result_id: number;
//   question_id: number;
//   user_id: number;
//   answer: ITestResultAnswerPayload;
//   created_at: string;
//   updated_at: string;
// }

// /**
//  * Полный результат теста от сервера.
//  */
// export interface ITestResultCreateResponse {
//   id: number;
//   user_id: number;
//   test_id: number;
//   score: number;
//   completed_at: string;
//   created_at: string;
//   updated_at: string;
//   answers: ITestResultAnswerResponse[];
// }

// ---------- результат теста ----------

/**
 * Тип значения ответа на вопрос
 */
export interface ITestResultAnswerPayload {
  value: string | number | string[] | number[] | Record<string, any>;
}

/**
 * Массив ответов
 */
export interface ITestResultAnswerRequest {
  question_id: number;
  answer: ITestResultAnswerPayload;
}

/**
 * Тело POST-запроса для создания результата теста
 */
export interface ITestResultCreateRequest {
  test_id: number;
  user_id?: number;
  score: number;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  answers: ITestResultAnswerRequest[];
}

/**
 * Детальная проверка ответа на вопрос
 */
export interface ICheckDetails {
  score: number;
  max_score: number;
  is_correct: boolean;
  details: {
    settings: {
      correctScore: number;
      showMaxScore: boolean;
      requireAnswer: boolean;
      incorrectScore: number;
      stopIfIncorrect: boolean;
    };
    user_choice: {
      answer: string;
    };
    correct_choice: string;
  };
  user_answer: {
    value: {
      answer: string;
    };
  };
  correct_answer: string[];
}

/**
 * Проверенный ответ на вопрос
 */
export interface ICheckedAnswer {
  score: number;
  max_score: number;
  is_correct: boolean;
  question_id: number;
  question_text: string;
  question_type: string;
  check_details: ICheckDetails;
}

/**
 * Поле "result" в ответе на создание теста
 */
export interface ITestResultAnalysis {
  percentage: number;
  total_score: number;
  checked_answers: ICheckedAnswer[];
}

/**
 * Ответ сервера при создании результата теста
 */
export interface ITestResultCreateResponse {
  id: number;
  user_id: number;
  test_id: number;
  score: number;
  completed_at?: number,
  result: ITestResultAnalysis;
}


/**
 * Интерфейс для таблицы с результами тестов
 */

export interface IUserTestResultRow {
  key: React.Key;       
  test_name: string;    
  name: string;    
  email: string;   
  total_score?: number;  
  end_date?: string;     
  test_time?: string;    
}

/**
 * Интерфейс для страницы результата теста
 */

export interface ITestResultIdPage {
  test_name: string;
  name: string;
  result: ITestResultCreateResponse;
}


//**
// Интерфейс для страницы профиля
//  */

export interface IRoleUser {
  name: string;
  code: string;
}

export interface IProfileUser {
  name: string;
  role_id: number;
  username: string;
  email: string;
  id: number;
  role: IRoleUser;
}

export interface IEditProfileReq {
  name: string;
  username: string;
  email: string;
}
