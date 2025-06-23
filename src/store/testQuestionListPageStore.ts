import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, postData } from '../api';
import { IQuestionInTest, IQuestionTypes } from '../interface/interfaceStore';

export default class testQuestionSPageStore {

    error: string = '';
    questionArray: IQuestionInTest[] = [];
    questionsTypesArray: IQuestionTypes[] = [];
    loadingQuestions = false;
    loadingQuestionTypes = false;
    onAlert?: (message: string, severity: 'success' | 'error') => void;

    constructor(onAlert?: (message: string, severity: 'success' | 'error') => void) {
        makeAutoObservable(this);
        this.onAlert = onAlert;
    }


    getQuestionListByTestId = async (id: number, force = false) => {
        if (this.loadingQuestions) return;
        if (!force && this.questionArray.length > 0) return;
        this.loadingQuestions = true;
        const result = await fetchData('getQuestionsById', {}, id);
        if (result)
            this.setQuestionArrays(result)
        this.loadingQuestions = false;
    }

    getQuestionTypes = async (force = false) => {
        if (this.loadingQuestionTypes) return;
        if (!force && this.questionsTypesArray.length > 0) return;
        this.loadingQuestionTypes = true;
        const result = await fetchData('getQuestionsTypes', {});
        if (result)
            this.setQuestionTypesArrays(result)
        this.loadingQuestionTypes = false;
    }

    deleteQuestionById = async (id: number, testId: number) => {
        try {
            const response = await fetch(`http://172.16.0.97:8012/api/questions/${id}/remove-from-test/${testId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response) {
                this.getQuestionListByTestId(testId);
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error creating question:', error);
            if (this.onAlert) {
                this.onAlert('Ошибка при создании вопроса', 'error');
            }
        }
    }


    setQuestionArrays = (value: IQuestionInTest[]) => {
        this.questionArray = value
        if (this.onAlert) {
            this.onAlert('Вопросы загружены', 'success');
        }
    }

    setQuestionTypesArrays = (value: IQuestionTypes[]) => {
        this.questionsTypesArray = value
    }



}
