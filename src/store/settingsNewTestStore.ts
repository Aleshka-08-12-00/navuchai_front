import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { ILocales, InterfaceTests, IPostTest, ITestCategories } from '../interface/interfaceStore';


export default class SettingsNewTestStore {

    error: string = '';
    publicLink: string = '';
    testCategories: ITestCategories[] = [];
    locales: ILocales[] = [];
    testMainInfo: InterfaceTests = {} as InterfaceTests

    constructor() {
        makeAutoObservable(this);
    }

    getTestCategories = async () => {
        const result = await fetchData('getCategories', {});
        if (result)
            this.setTestCategories(result)
    }

    postTestCategories = async (value: string) => {
        const result = await postData('postCategories', { name: value });
        if (result)
            alert('новая категория создана')
        this.getTestCategories()
    }

    getTestById = async (id: number) => {
        const result = await fetchData('getTestsById', {}, id);
        if (result)
        this.setTestById(result)
    }

    setTestById = (value: InterfaceTests) => {
        console.log('33333333')
        console.log(value)

        this.testMainInfo = value
        console.log(this.testMainInfo)
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
        const result = await postData('postTests', data);
        if (result) {
            window.location.href = window.location.href + '/' + result.id;
            alert('Тест успешно создан, продолжайте настраивать тест');
        }
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
