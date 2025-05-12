import { makeAutoObservable } from 'mobx';
import { postData } from '../api';
import { jwtDecode } from "jwt-decode";
import { ILoginUser, IRegisterUser } from '../interface/interfaceStore';

export default class AuthStore {

  isAuth: boolean = false
  error: string = ''
  userId: number = 2
  roleCode: string = ''

  constructor() {
    makeAutoObservable(this);
  }

  objForShow: string[] = []

  async loginUser(loginData: ILoginUser) {
    try {
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await postData(
        'postAuth',
        formData,
      );

      //@ts-ignore
      localStorage.setItem('tokenNavuchai', response.access_token);
      window.location.replace('/');

      this.setAuth(true);

    } catch (error: any) {
      this.setAuth(false);
      if (error instanceof Error) {
        this.error = error.message;
      } else {
        this.error = 'Произошла неизвестная ошибка при входе';
      }
      console.error('Registration error:', this.error);
      return null;
    }
  }

  async registerUser(data: IRegisterUser) {
    try {
      const response = await postData('postRegistration', data);
      localStorage.setItem('tokenNavuchai', response.access_token);
      window.location.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        this.error = error.message;
      } else {
        this.error = 'Произошла неизвестная ошибка при регистрации';
      }
      console.error('Registration error:', this.error);
      return null;
    }
  }


  initAuth(result: any) {
    if (result && (result as { data: { token: string; refreshToken: string; accessCodes: any[]; }[] }).data[0]) {
      const data = (result as { data: { token: string; refreshToken: string; accessCodes: any[]; }[] }).data[0];
      localStorage.setItem('tokenHR', data.token);
      localStorage.setItem('refreshTokenHR', data.refreshToken);
      localStorage.setItem('accessCodes', JSON.stringify(data.accessCodes));
      this.setAuth(true);
      window.location.replace('/');
    }
  }

  async loginRoot(id: string) {
    const dataObj = {
      id: id
    }
    const result = await postData('postAuthLoginRoot', dataObj);
    this.initAuth(result);
  }

  setObjForShow = () => {
    let obj = []
    let value = localStorage.getItem('accessCodes')
    if (value) {
      obj = JSON.parse(value)
    }
    this.objForShow = obj
    // let token = localStorage.getItem('tokenHR');
    // if (token) {
    //     const payload = jwtDecode(token); // Используем jwt_decode для декодирования токена
    //     //@ts-ignore
    //     this.roleCode = payload.role_code
    //     //@ts-ignore
    //     this.userId = payload.id
    // }
  }

  logout = () => {
    localStorage.removeItem('tokenHR')
    this.setAuth(false);
    window.location.reload()
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

}

export const authStore = new AuthStore();
