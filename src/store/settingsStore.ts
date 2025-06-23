import { makeAutoObservable } from 'mobx';

export type AccessType = 'public' | 'private' | 'group' | 'training';

export default class SettingsStore {

    error: string = ''
    idSettingsNumber: string = '51';
    idSettingsNumberNext: string = '41'
    accessType: AccessType = 'group';

    constructor() {
        makeAutoObservable(this);
    }

    setAccessType = (type: AccessType) => {
        this.accessType = type;
    }

    setIdSettingsNumber = (value: string) => {
        this.idSettingsNumber = value
    }

     setIdSettingsNumberNext = (value: string) => {
        this.idSettingsNumberNext = value
    }


}
