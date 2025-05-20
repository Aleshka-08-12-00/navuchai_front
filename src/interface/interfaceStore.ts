export interface InterfaceTests {
  id: number;
  title: string;
  description: string;
  category_id: number;
  creator_id: number;
  access_timestamp: string;
  status_id: number;
  frozen : boolean;
  locale_id: number;
  time_limit: number;
  img_id: null | number; // Assuming img_id can be null or number
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
  percent?: number; // Added optional percent
  completed?: number; // Added optional completed
  status_name_ru?: string; // Added optional status_name_ru
  status_color?: string; // Added optional status_color
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
      correctScore: number,
      incorrectScore: number,
      showMaxScore: boolean,
      requireAnswer: boolean,
      stopIfIncorrect: boolean
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
      correctScore: number,
      incorrectScore: number,
      showMaxScore: boolean,
      requireAnswer: boolean,
      stopIfIncorrect: boolean
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
    answers:  {
      settings: {
          correctScore: number,
          showMaxScore: boolean,
          requireAnswer: boolean,
          incorrectScore: number,
          stopIfIncorrect: boolean,
      },
      allAnswer: string[],
      correctAnswer: string[]
  }
    created_at: string;
    updated_at: string;
  };
  position: number;
  required: boolean;
  max_score: number;
}

export interface ITestStatus 
{
  name: string;
  code: string;
  name_ru: string;
  color: string;
  id: number;
  created_at: string;
  updated_at: string;
}
