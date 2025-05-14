import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { InterfaceTests, IPostTest, ITestCategories } from '../interface/interfaceStore';


export default class SettingsNewTestStore {

    error: string = '';
    testCategories: ITestCategories[] = []
    
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


}
