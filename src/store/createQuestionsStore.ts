import { makeAutoObservable } from 'mobx';
import { fetchData, postData, putData } from '../api';
import { IPostQuestion } from '../interface/interfaceStore';
import endpoints from '../endpoints';

export default class CreateQuestionsStore {

    error: string = '';
    onAlert?: (message: string, severity: 'success' | 'error') => void;

    constructor(onAlert?: (message: string, severity: 'success' | 'error') => void) {
        makeAutoObservable(this);
        this.onAlert = onAlert;
    }

    postQuestion = async (data: IPostQuestion, testId: number) => {
        try {
            const result = await postData('postQuestions', data);
            if (result?.id) {
                const response = await fetch(`https://navuchaiback.sellwin.by/api/questions/${result.id}/add-to-test/${testId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                if (this.onAlert) {
                    this.onAlert(`Вопрос создан и добавлен в тест № ${testId}`, 'success');
                }
            }
        } catch (error) {
            console.error('Error creating question:', error);
            if (this.onAlert) {
                this.onAlert('Ошибка при создании вопроса', 'error');
            }
        }
    }

    putQuestion = async (data: IPostQuestion, id: number) => {
        try {
            const result = await putData('putQuestionsById', data , id);
            if (result?.id) {
             console.log(result.id)
            }
        } catch (error) {
            console.error('Error creating question:', error);
            if (this.onAlert) {
                this.onAlert('Ошибка при создании вопроса', 'error');
            }
        }
    }

 


    // setTestCategories = (value: ITestCategories[]) => {
    //     this.testCategories = value
    // }

  

}
