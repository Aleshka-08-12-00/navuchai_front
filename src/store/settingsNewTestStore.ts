import { makeAutoObservable } from 'mobx';
import { fetchData, postData, putData } from '../api';
import { ILocales, InterfaceTests, IPostTest, ITestCategories } from '../interface/interfaceStore';


class SettingsNewTestStore {

    error: string = '';
    publicLink: string = '';
    testCategories: ITestCategories[] = [];
    locales: ILocales[] = [];
    testMainInfo: InterfaceTests = {} as InterfaceTests
    timeLimit: number = 0;
    loadingTestCategories = false;
    loadingTestById = false;
    loadingLocales = false;

    constructor() {
        makeAutoObservable(this);
    }

    get timeLimitFromTest(): number {
        const test_limit_time = this.testMainInfo?.time_limit ?? 0;

        return test_limit_time;
    }

    getTestCategories = async (force = false) => {
        if (this.loadingTestCategories) return;
        if (!force && this.testCategories.length > 0) return;
        this.loadingTestCategories = true;
        const result = await fetchData('getCategories', {});
        if (result)
            this.setTestCategories(result)
        this.loadingTestCategories = false;
    }

    postTestCategories = async (value: string) => {
        const result = await postData('postCategories', { name: value });
        if (result)
        this.getTestCategories()
    }

    getTestById = async (id: number, force = false) => {
        if (this.loadingTestById) return;
        if (!force && this.testMainInfo && this.testMainInfo.id === id) return;
        this.loadingTestById = true;
        const result = await fetchData('getTestsById', {}, id);
        if (result)
            this.setTestById(result)
        this.loadingTestById = false;
    }

    setTestById = (value: InterfaceTests) => {
        this.testMainInfo = value
    }

    getLocales = async (force = false) => {
        if (this.loadingLocales) return;
        if (!force && this.locales.length > 0) return;
        this.loadingLocales = true;
        const result = await fetchData('getLocales', {});
        if (result)
            this.setLocales(result)
        this.loadingLocales = false;
    }

    setTestCategories = (value: ITestCategories[]) => {
        this.testCategories = value
    }

    setLocales = (value: ILocales[]) => {
        this.locales = value
    }

    createNewTest = async (data: IPostTest) => {
        const result = await postData('postTests', data);
        if (result) {
            window.location.href = window.location.href + '/' + result.id;
        }
    }

    updateTest = async (data: IPostTest, id: number) => {
        const result = await putData('putTestsById', data, id);
        if (result) {
            this.getTestById(id, true);
        }
    }

    updateTestStatus = async (data: InterfaceTests, id: number) => {
        const result = await putData('putTestsById', data, id);
        if (result) {
            return result;
        }
        return null;
    }

    generatePublicLink = () => {
        const randomId = this.generateCryptoString(12);
        const baseUrl = 'https://navuchai.by/test/';
        this.publicLink = baseUrl + randomId;
    };

    private generateCryptoString(length: number): string {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = new Uint8Array(length);
        window.crypto.getRandomValues(values);
        return Array.from(values)
            .map((v) => charset[v % charset.length])
            .join('');
    }

}

export const settingsNewTestStore = new SettingsNewTestStore();
export default settingsNewTestStore;
