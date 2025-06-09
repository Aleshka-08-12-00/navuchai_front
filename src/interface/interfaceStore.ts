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

/** ----------------------------------------------------------- * API RESULTS ------------------------------------------------------ */

/** * POST METHOD RESULT */

export interface IAnswerValue {
  value: string | string[] | boolean;
}

export interface ITestResultAnswerRequest {
  question_id: number;
  time_start: string; 
  time_end: string;   
  answer: IAnswerValue;
}

export interface ITestResultCreateRequest {
  test_id: number;
  user_id: number;
  time_start: string; 
  time_end: string;  
  answers: ITestResultAnswerRequest[];
}

/** * RESPONSE BY RESULT (SUCCESS or BAD) */

export interface ITextCheckDetails {
  correct_answer: string;
  user_answer: string;
}

export interface IChoiceCheckDetails {
  correct_answers: string[];
  user_answers: string[];
}

export type ICheckDetails = ITextCheckDetails | IChoiceCheckDetails;

export interface ICheckedAnswer {
  question_id: number;
  question_text: string;
  question_type: string;
  max_score: number;
  score: number;
  is_correct: boolean;
  check_details: ICheckDetails;
  time_start: string;
  time_end: string;
  time_seconds: number;
  time_limit: number;
  is_time_exceeded: boolean;
}

export interface ITestResultAnalysis {
  total_score: number;
  max_possible_score: number;
  percentage: number;
  checked_answers: ICheckedAnswer[];
  time_start: string;
  time_end: string;
  total_time_seconds: number;
  test_time_limit: number;
  is_passed: boolean;
  message?: string;
}

/** * GENERAL RESPONSE BY RESULT */

export interface ITestResultCreateResponse {
  id: number;
  test_id: number;
  user_id: number;
  score: number;
  result: ITestResultAnalysis;
  time_start: string;
  time_end: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

/** * ERROR HANDLER BY RESULT */

export interface IErrorResponse {
  detail: string;
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

export interface IRespondentMember {
  user_id: number;
  group_id: number;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface IRespondentLists {
  name: string;
  description: string;
  id: number;
  creator_id: number;
  created_at: string;
  updated_at: string;
  members: IRespondentMember[];
}

export interface IUsers {
  name: string;
  role_id: number;
  username: string;
  email: string;
  id: number;
  role: {
    name: string;
    code: string;
  };
  created_at: string;
  updated_at: string;
}

