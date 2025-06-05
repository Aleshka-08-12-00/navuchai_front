import { makeAutoObservable, runInAction } from "mobx";
import { fetchData, postData } from "../api/index";
import {
  ITestResultCreateRequest,
  ITestResultCreateResponse,
  IUserTestResultRow,
} from "../interface/interfaceStore";
import authStore from "./authStore";

declare global {
  interface Window {
    AndroidBridge?: {
      notifyTestPassed: () => void;
    }
  }
}

export default class TestResultStore {
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  resultsByUserIdArray: ITestResultCreateResponse[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Получить все результаты по user_id
   */
  getResultByUser = async (user_id: number) => {
    try {
      const result = await fetchData("getResultsByUserId", {}, user_id);
      if (result) {
        runInAction(() => {
          this.setResultsArrays(result);
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки результатов";
      });
    }
  };

  /**
   * Установить массив результатов пользователя
   */
  setResultsArrays = (value: ITestResultCreateResponse[]) => {
    this.resultsByUserIdArray = value;
  };

  /**
   * Отформатированные данные для таблицы
   */
  getFormattedUserResults = (): IUserTestResultRow[] => {
    return this.resultsByUserIdArray.map((result) => ({
      key: result.id.toString(),
      test_name: "Неизвестно", // можно заменить, если появится поле test_name
      name: authStore.name || "—",
      email: authStore.email || "—",
      total_score: result.result?.total_score ?? result.score,
      end_date: "—",
      test_time: "—", // если появится продолжительность, можно вставить
    }));
  };

  /**
   * Отправка результата прохождения теста
   */
  createTestResult = async (
    payload: Omit<ITestResultCreateRequest, "user_id">
  ): Promise<ITestResultCreateResponse | null> => {
    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      if (!authStore.userId) {
        throw new Error("Пользователь не авторизован. user_id отсутствует.");
      }

      const formattedAnswers = payload.answers.map((a) => ({
        question_id: a.question_id,
        answer:  a.answer ,
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
        console.log("Результат теста:", data);
      });

      if (window.AndroidBridge?.notifyTestPassed) {
        window.AndroidBridge.notifyTestPassed();
      }

      return data; // ✅ возвращаем результат
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка создания результата теста";
        this.loading = false;
      });
      return null; // ✅ возвращаем null при ошибке
    }
  };
}
