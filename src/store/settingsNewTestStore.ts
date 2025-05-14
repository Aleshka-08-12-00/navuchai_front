import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { InterfaceTests, IPostTest, ITestCategories } from '../interface/interfaceStore';


export default class SettingsNewTestStore {

    error: string = '';
    testCategories: ITestCategories[] = []
    publicLink: string = '';
    
    constructor() {
        makeAutoObservable(this);
    }

    getTestCategories = async () => {
        const result = await fetchData('getCategories', {});
        if (result)
            this.setTestCategories(result)
    }

    setTestCategories = (value: ITestCategories[]) => {
        this.testCategories = value
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
