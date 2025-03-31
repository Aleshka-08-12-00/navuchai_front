import { makeAutoObservable } from 'mobx';

export default class SettingsStore {

    error: string = ''
    idSettingsNumber: string = '41'
    constructor() {
        makeAutoObservable(this);
    }

    setIdSettingsNumber = (value: string) => {
        this.idSettingsNumber = value
    }


}
