import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData } from '../api';
import { InterfaceTests, ITestCategories, ITestStatus } from '../interface/interfaceStore';

export default class MainPageStore {

    error: string = '';
    testsArray: InterfaceTests[] = [];
    categoriesArray: ITestCategories[] = []
    testStatusesArray: ITestStatus[] =[];
    
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

    getCategories = async () => {
        const result = await fetchData('getCategories', {});
        if (result)
            this.setCategories(result)
    }

    setCategories = (value: ITestCategories[]) => {
        this.categoriesArray = value
      }

    getTestStatuses = async () => {
        const result = await fetchData('getTestStatuses', {});
        if (result)
            this.setTestStatuses(result)
    }

    setTestStatuses = (value: ITestStatus[]) => {
        this.testStatusesArray = value
      }

    deleteTestById = async (id: number) => {
        const result = await deleteData('deleteTestsById', {}, id);
        if (result)
            this.getTests()
    }

  
      
}
