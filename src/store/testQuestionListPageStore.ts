import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { IQuestionInTest } from '../interface/interfaceStore';

export default class testQuestionSPageStore {

    error: string = '';
    questionArray: IQuestionInTest[] = []

    constructor() {
        makeAutoObservable(this);
    }


    getQuestionListByTestId = async (id: number) => {
        const result = await fetchData('getQuestionsById', {}, id);
        if (result)
            this.setQuestionArrays(result)
    }


    setQuestionArrays = (value: IQuestionInTest[]) => {
        this.questionArray = value
        alert('Вопрос загружены')
    }



}
