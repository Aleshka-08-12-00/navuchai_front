import { makeAutoObservable } from 'mobx';
import { postData } from '../api';
import { jwtDecode } from "jwt-decode";
import { ILoginUser, IRegisterUser } from '../interface/interfaceStore';
import axios from 'axios';

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

          const response = await axios.post(
            'http://172.16.0.97:8012/auth/login',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
      
          const { access_token } = response.data;
      
          localStorage.setItem('tokenNavuchai', access_token);
      
          this.setAuth(true);
      
          return response.data;
        } catch (error: any) {
          this.setAuth(false);
      
          return null;
        }
      }

    async registerUser(data: IRegisterUser) {
        try {
          const response = await axios.post('http://172.16.0.97:8012/auth/register', data);  
          console.log('Registration successful:', response.data);
          return response.data;
        } catch (error: any) {
          this.error = error.response?.data?.message || 'Ошибка при регистрации';
          console.error('Registration error:', this.error);
          return null
        }
    }


    initAuth(result: any){
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
