import { makeAutoObservable } from 'mobx';
import { postData } from '../api';
import { jwtDecode } from "jwt-decode";

export default class AuthStore {

    isAuth: boolean = false
    error: string = ''
    userId: number = 0
    roleCode: string = ''

    constructor() {
        makeAutoObservable(this);
    }

    objForShow: string[] = []

    async loginUser(login: string, password: string) {
        this.error = ''
        const dataObj = {
            login: login,
            password: password
        }
        const result = await postData('postAuthLogin', dataObj);
        //@ts-ignore
        if(result && result.code ==='ERR_BAD_REQUEST' ){
            //@ts-ignore
            this.error = result.response.data.message
        }else{
            this.initAuth(result);
        }
        // this.initAuth(result);
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
