import { makeAutoObservable, runInAction } from "mobx";
import { IQuestionInTest} from "../interface/interfaceStore";
import { fetchData } from "../api/index"; 

class QuestionsStore {
  questions: IQuestionInTest[] = [];
  loading = false;
  error: string | null = null;
  loadingQuestions = false;
  loadingQuestionsPublic = false;
  
  get questionsObj() {
    return new Map(this.questions.map((q) => [q.question.id, q]));
  }

  constructor() {
    makeAutoObservable(this);
  }

  fetchQuestionsByTestId = async (testId: number, force = false) => {
    if (this.loadingQuestions) return;
    if (!force && this.questions.length > 0) return;
    this.loadingQuestions = true;
    this.loading = true;
    this.error = null;

    try {
      const data: IQuestionInTest[] = await fetchData("getQuestionsByTestId", {}, testId);
      runInAction(() => {
        this.questions = data;
        this.loading = false;
        this.loadingQuestions = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки";
        this.loading = false;
        this.loadingQuestions = false;
      });
    }
  };  

   fetchQuestionsByTestIdPublick = async (testId: number, force = false) => {
    if (this.loadingQuestionsPublic) return;
    if (!force && this.questions.length > 0) return;
    this.loadingQuestionsPublic = true;
    this.loading = true;
    this.error = null;

    try {
      const data: IQuestionInTest[] = await fetchData("getQuestionsByTestIdPublic", {}, testId);
      runInAction(() => {
        this.questions = data;
        this.loading = false;
        this.loadingQuestionsPublic = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки";
        this.loading = false;
        this.loadingQuestionsPublic = false;
      });
    }
  };  


}





const questionsStore = new QuestionsStore();
export default questionsStore;
