import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { ILoginUser, IRegisterUser } from '../interface/interfaceStore';

class AuthStore {
  isAuth: boolean = false;
  error: string = '';
  userId: number | null = null;
  roleCode: string = '';
  objForShow: string[] = [];
  name: string = '';
  email: string = '';
  roleName: string = ''

  constructor() {
    makeAutoObservable(this);
  }

  setUserData = (userData: any) => {
    this.userId = userData.id;
    this.roleCode = userData.role_code;
    this.isAuth = true;
    this.email = userData.email;
    this.name = userData.name;
    this.roleName = userData.role_name;
  };

  async loginUser(loginData: ILoginUser) {
    try {
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await postData('postAuth', formData);
      //@ts-ignore
      localStorage.setItem('tokenNavuchai', response.access_token);
      window.location.replace('/');
    } catch (error: any) {
      this.setAuth(false);
      this.error = error instanceof Error ? error.message : 'Произошла неизвестная ошибка при входе';
      console.error('Login error:', this.error);
    }
  }

  async registerUser(data: IRegisterUser) {
    try {
      const response = await postData('postRegistration', data);
      localStorage.setItem('tokenNavuchai', response.access_token);
      window.location.replace('/');
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Произошла неизвестная ошибка при регистрации';
      console.error('Registration error:', this.error);
    }
  }

  authMe = async () => {
    const result = await fetchData('getAuthMe');
    if (result) {
      console.log(result)
      this.setUserData(result);
    }
    return null;
  };

  setObjForShow = () => {
    let obj = [];
    const value = localStorage.getItem('accessCodes');
    if (value) {
      obj = JSON.parse(value);
    }
    this.objForShow = obj;
  };

  logout = () => {
    localStorage.removeItem('tokenNavuchai');
    this.setAuth(false);
    this.userId = null;
    window.location.reload();
  };

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
}

export const authStore = new AuthStore();
export default authStore;
