import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { ILocales, IPostTest, ITestCategories } from '../interface/interfaceStore';


export default class SettingsNewTestStore {

    error: string = '';
    publicLink: string = '';
    testCategories: ITestCategories[] = [];
    locales: ILocales[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getTestCategories = async () => {
        const result = await fetchData('getCategories', {});
        if (result)
            this.setTestCategories(result)
    }

    postTestCategories = async (value: string) => {
        const result = await postData('postCategories', {name: value});
        if (result)
            alert('новая категория создана')
            this.getTestCategories()
    }

    getLocales = async () => {
        const result = await fetchData('getLocales', {});
        if (result)
            this.setLocales(result)
    }

    setTestCategories = (value: ITestCategories[]) => {
        this.testCategories = value
    }

    setLocales = (value: ILocales[]) => {
        this.locales = value
    }
    
    createNewTest = async (data: IPostTest) => {
        const result = await postData('postTests', {data});
        if (result)
            alert('Тест успешно создан, продолжайте настраивать тест')
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
