import { makeAutoObservable } from 'mobx';
import { fetchData, postData } from '../api';
import { IPostQuestion } from '../interface/interfaceStore';
import endpoints from '../endpoints';

export default class CreateQuestionsStore {

    error: string = '';
 

    constructor() {
        makeAutoObservable(this);
    }

    postQuestion = async (data: IPostQuestion, testId: number) => {
        try {
            const result = await postData('postQuestions', data);
            if (result?.id) {
                const response = await fetch(`http://172.16.0.97:8012/api/questions/${result.id}/add-to-test/${testId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                alert(`Вопрос создан и добавлен в тест № ${testId}`);
            }
        } catch (error) {
            console.error('Error creating question:', error);
            alert('Ошибка при создании вопроса');
        }
    }


    // setTestCategories = (value: ITestCategories[]) => {
    //     this.testCategories = value
    // }

  

}
