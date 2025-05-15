import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { IPostQuestion } from '../interface/interfaceStore';

export default class CreateQuestionsStore {

    error: string = '';
 

    constructor() {
        makeAutoObservable(this);
    }

    postQuestion = async (data: IPostQuestion) => {
        const result = await postData('postQuestions', data);
        if (result)
            alert('Вопрос создан')
            
    }


    // setTestCategories = (value: ITestCategories[]) => {
    //     this.testCategories = value
    // }

  

}
