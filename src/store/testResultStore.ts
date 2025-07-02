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
    };
  }
}

export default class TestResultStore {
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  resultsByUserIdArray: ITestResultCreateResponse[] = [];
  loadingResultsByUser = false;

  constructor() {
    makeAutoObservable(this);
  }

  getResultByUser = async (user_id: number, force = false) => {
    if (this.loadingResultsByUser) return;
    if (!force && this.resultsByUserIdArray.length > 0) return;
    this.loadingResultsByUser = true;
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
    } finally {
      this.loadingResultsByUser = false;
    }
  };

  setResultsArrays = (value: ITestResultCreateResponse[]) => {
    this.resultsByUserIdArray = value;
  };

  getFormattedUserResults = (): IUserTestResultRow[] => {
    return this.resultsByUserIdArray.map((result) => ({
      key: result.id.toString(),
      test_name: "Неизвестно",
      name: authStore.name || "—",
      email: authStore.email || "—",
      total_score: result.result?.total_score ?? result.score,
      end_date: "—",
      test_time: "—",
      percentage: result.result.percentage,
      test_time_seconds: result.result.total_time_seconds,
    }));
  };

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

      const fullPayload: ITestResultCreateRequest = {
        ...payload,
        user_id: authStore.userId,
      };

      console.log("Отправка payload:", fullPayload);

      const data: ITestResultCreateResponse = await postData("postResults", fullPayload);

      runInAction(() => {
        this.result = data;
        this.loading = false;
        console.log("Результат теста:", data);
      });

      return data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка создания результата теста";
        this.loading = false;
      });
      return null;
    }
  };
}
