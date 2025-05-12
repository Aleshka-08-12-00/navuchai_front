
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
  category_id: number,
  creator_id: number,
  access_timestamp: string;
  status: string;
  frozen: boolean;
  locale: string;
  time_limit: number;
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
