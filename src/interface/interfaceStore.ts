
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

export interface IRegisterUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

export interface ILoginUser {
  username: string;
  password: string;
}
