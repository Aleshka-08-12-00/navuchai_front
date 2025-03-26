import $api from "../http";

export default class AuthService {
    // static async login(login: string, password: string) {
    //     return $api.post('/auth/bitrix', {login, password} )
    // }

    static async login(login: string, password: string) {
        return $api.post('/auth/login', {login, password} )
    }

  

    static async logout() {
        return $api.post('/logout', )
    }
}

