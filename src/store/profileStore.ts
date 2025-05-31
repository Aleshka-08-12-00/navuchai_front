import { makeAutoObservable, runInAction } from 'mobx';
import { IEditProfileReq, IProfileUser } from '../interface/interfaceStore';
import { fetchData, putData } from '../api';


export default class ProfileStore {

    error: string = '';
    profile: IProfileUser | null = null;
 
    constructor() {
        makeAutoObservable(this);
    }


    async getProfile() {
        try {
            const response = await fetchData('getProfile');
            if (response) {
                runInAction(() => {
                    this.profile = response;
                });
            }
        } catch (error: any) {
            runInAction(() => {
                this.error = error.message || 'Ошибка при получении профиля';
            });
        }
    }

    async putProfile(data: IEditProfileReq) {
            try {
                const response = await putData('putProfile', data); 
                if (response) {
                    runInAction(() => {
                        this.profile = response;
                    });
                    return true;
                }
            } catch (error: any) {
                runInAction(() => {
                    this.error = error.message || 'Ошибка при обновлении профиля';
                });
            }
        return false;
    }

    async changePassword(oldPassword: string, newPassword: string) {
    try {
        const response = await putData('putPassword', { oldPassword, newPassword });
        return !!response;
    } catch (error: any) {
        runInAction(() => {
            this.error = error.message || 'Ошибка при смене пароля';
        });
        return false;
    }
}

}
