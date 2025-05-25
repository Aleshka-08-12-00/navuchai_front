import { makeAutoObservable, runInAction } from "mobx";
import { postData } from "../api/index";
import {
  ITestResultCreateRequest,
  ITestResultCreateResponse,
} from "../interface/interfaceStore";
import authStore from "./authStore";


export default class TestResultStore {
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createTestResult = async (payload: Omit<ITestResultCreateRequest, "user_id">) => {
    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      if (!authStore.userId) {
        throw new Error("Пользователь не авторизован. user_id отсутствует.");
      }

      const formattedAnswers = payload.answers.map(a => ({
        question_id: a.question_id,
        answer: { value: a.answer },  // оборачиваем answer в объект с ключом value
      }));

      const fullPayload: ITestResultCreateRequest = {
        ...payload,
        user_id: authStore.userId,
        answers: formattedAnswers,
      };

      const data: ITestResultCreateResponse = await postData("postResults", fullPayload);

      runInAction(() => {
        this.result = data;
        this.loading = false;
        console.log(data);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка создания результата теста";
        this.loading = false;
      });
    }
  };
}
