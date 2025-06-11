import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { IQuestionInTest } from '../interface/interfaceStore';

export default class testQuestionSPageStore {

    error: string = '';
    questionArray: IQuestionInTest[] = []
    onAlert?: (message: string, severity: 'success' | 'error') => void;

    constructor(onAlert?: (message: string, severity: 'success' | 'error') => void) {
        makeAutoObservable(this);
        this.onAlert = onAlert;
    }


    getQuestionListByTestId = async (id: number) => {
        const result = await fetchData('getQuestionsById', {}, id);
        if (result)
            this.setQuestionArrays(result)
    }


    setQuestionArrays = (value: IQuestionInTest[]) => {
        this.questionArray = value
        if (this.onAlert) {
            this.onAlert('Вопросы загружены', 'success');
        }
    }



}
