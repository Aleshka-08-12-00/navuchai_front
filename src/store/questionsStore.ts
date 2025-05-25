import { makeAutoObservable, runInAction } from "mobx";
import { IQuestionInTest} from "../interface/interfaceStore";
import { fetchData } from "../api/index"; 

export default class QuestionsStore {
  questions: IQuestionInTest[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchQuestionsByTestId = async (testId: number) => {
    this.loading = true;
    this.error = null;

    try {
      const data: IQuestionInTest[] = await fetchData("getQuestionsByTestId", {}, testId);
      runInAction(() => {
        this.questions = data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки";
        this.loading = false;
      });
    }
  };
}
