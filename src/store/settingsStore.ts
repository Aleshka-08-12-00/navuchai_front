import { makeAutoObservable } from 'mobx';

export type AccessType = 'public' | 'private' | 'group' | 'training';

export default class SettingsStore {

    error: string = ''
    idSettingsNumber: string = '41'
    accessType: AccessType = 'public';

    constructor() {
        makeAutoObservable(this);
    }

    setAccessType = (type: AccessType) => {
        this.accessType = type;
    }

    setIdSettingsNumber = (value: string) => {
        this.idSettingsNumber = value
    }


}
