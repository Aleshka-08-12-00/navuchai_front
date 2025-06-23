import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, putData } from '../api';
import { InterfaceTests, ITestCategories, ITestStatus } from '../interface/interfaceStore';

export default class MainPageStore {

    error: string = '';
    testsArray: InterfaceTests[] = [];
    categoriesArray: ITestCategories[] = []
    testStatusesArray: ITestStatus[] =[];
    loadingTests = false;
    loadingCategories = false;
    loadingStatuses = false;
    
    constructor() {
        makeAutoObservable(this);
    }

    getTests = async (force = false) => {
        if (this.loadingTests) return;
        if (!force && this.testsArray.length > 0) return;
        this.loadingTests = true;
        const result = await fetchData('getTests', {});
        if (result)
            this.setTest(result)
        this.loadingTests = false;
    }

    setTest = (value: InterfaceTests[]) => {
        this.testsArray = value
      }

    getCategories = async (force = false) => {
        if (this.loadingCategories) return;
        if (!force && this.categoriesArray.length > 0) return;
        this.loadingCategories = true;
        const result = await fetchData('getCategories', {});
        if (result)
            this.setCategories(result)
        this.loadingCategories = false;
    }

    setCategories = (value: ITestCategories[]) => {
        this.categoriesArray = value
      }

    getTestStatuses = async (force = false) => {
        if (this.loadingStatuses) return;
        if (!force && this.testStatusesArray.length > 0) return;
        this.loadingStatuses = true;
        const result = await fetchData('getTestStatuses', {});
        if (result)
            this.setTestStatuses(result)
        this.loadingStatuses = false;
    }

    setTestStatuses = (value: ITestStatus[]) => {
        this.testStatusesArray = value
      }

    deleteTestById = async (id: number) => {
        const result = await deleteData('deleteTestsById', {}, id);
        if (result)
            this.getTests()
    }

    putTestById = async (id: number) => {
        const result = await putData('putTestsById', {}, id);
        if (result)
            console.log(result);
    }   
}
