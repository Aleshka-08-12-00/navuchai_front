export interface InterfaceTests {
  id: number,
  access_timestamp: string,
  category_id: number,
  category_name: string,
  creator_id: number,
  creator_name: string,
  description: string,
  frozen: boolean,
  locale: string,
  status: string,
  time_limit: number
  title: string,
}

export interface IPostTest {
  title: string;
  description: string;
  category_id: number;
  creator_id: number;
  access_timestamp: string;
  status: string;
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