import { makeAutoObservable } from 'mobx';
import { fetchData } from '../api';
import { InterfaceTests } from '../interface/interfaceStore';

export default class MainPageStore {

    error: string = ''
    testsArray: InterfaceTests[] = []
    
    constructor() {
        makeAutoObservable(this);
    }

    getTests = async () => {
        const result = await fetchData('getTests', {});
        if (result)
            this.setTest(result)
    }

    setTest = (value: InterfaceTests[]) => {
        this.testsArray = value
      }
}
