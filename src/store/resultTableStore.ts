import { makeAutoObservable, runInAction } from "mobx";
import { fetchData } from "../api/index";
import {
  ICheckedAnswer,
  ITestResultCreateResponse,
  IUserTestResultRow,
} from "../interface/interfaceStore";
import settingsNewTestStore from "./settingsNewTestStore";
import userStore from "./userStore";

export default class ResultTableStore {
  resultsArray: ITestResultCreateResponse[] = [];
  testNamesMap = new Map<number, string>();
  selectedResult: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  loadingResults = false;

  constructor() {
    makeAutoObservable(this);
  }

  exportResultsExcel = async () => {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetchData("exportResultsExcel", {}, null, { responseType: "blob" });
      const blob = response instanceof Blob ? response : new Blob([response]);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.message || "Ошибка загрузки результатов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  fetchAndStoreTestName = async (testId: number) => {
    if (this.testNamesMap.has(testId)) return;

    try {
      const test = await fetchData("getTestsById", {}, testId);
      let name = "Неизвестно";
      if (test && typeof test === "object" && Object.keys(test).length > 0) {
        name = test.title ?? "Неизвестно";
      } else {
        name = "Тест не найден";
      }
      runInAction(() => {
        this.testNamesMap.set(testId, name);
      });
    } catch (e) {
      runInAction(() => {
        this.testNamesMap.set(testId, "Неизвестно");
      });
    }
  };

  getResults = async (force = false) => {
    if (this.loadingResults) return;
    if (!force && this.resultsArray.length > 0) return;
    this.loadingResults = true;
    this.loading = true;
    this.error = null;

    try {
      const result = await fetchData("getResults");
      if (result) {
        await this.setResultsArray(result);
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.message || "Ошибка загрузки результатов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
        this.loadingResults = false;
      });
    }
  };

  setResultsArray = async (value: ITestResultCreateResponse[]) => {
    runInAction(() => {
      this.resultsArray = value;
    });
    // Данные test и user уже есть во вложенных объектах, дополнительные запросы не нужны
  };

  getFormattedUserResults(): IUserTestResultRow[] {
    return this.resultsArray.map((res) => ({
      key: res.id,
      test_name: res.test?.title ?? "—",
      name: res.user?.name ?? "",
      email: res.user?.email ?? "",
      percentage: res.result?.percentage ?? 0,
      end_date: res.completed_at ? new Date(res.completed_at).toLocaleString() : "",
      test_time: this.formatTime(res.result?.total_time_seconds ?? 0),
      test_time_seconds: res.result?.total_time_seconds ?? 0,
    }));
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} мин ${seconds.toString().padStart(2, "0")} сек`;
  }

  getResultByResultId = async (resultId: number) => {
    if (!resultId || isNaN(resultId)) return;

    this.loading = true;
    this.error = null;

    try {
      const data = await fetchData("getResultByResultId", {}, resultId);
      runInAction(() => {
        this.selectedResult = data;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.message || "Ошибка при загрузке результата";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  getInfoByIdResultTest = async (resultId: number) => {
    this.loading = true;
    this.error = null;

    try {
      const data = await fetchData("getResultByResultId", {}, resultId);

      runInAction(() => {
        this.selectedResult = data;
      });

      const { test_id: testId, user_id: userId, result } = data;
      const percentage = result?.percentage ?? 0;
      const completedAt = data?.completed_at ?? null;

      await Promise.all([
        testId ? this.fetchAndStoreTestName(testId) : Promise.resolve(),
        userId ? userStore.getUserById(userId) : Promise.resolve(),
      ]);

      const testName = this.testNamesMap.get(testId) ?? "Неизвестно";
      const userName = userStore.getUserField(userId, "name") ?? "Неизвестно";

      const questions = (result?.checked_answers ?? []).map((item: any) => {
  // Получаем userAnswers в виде массива строк, даже если там одна строка
      let userAnswers: string[] = [];
      if (item.check_details.user_answers) {
        userAnswers = item.check_details.user_answers;
      } else if (item.check_details.user_answer) {
        userAnswers = [item.check_details.user_answer];
      }

      // Правильные ответы из options.correctAnswer
      const correctAnswers: string[] = item.options?.correctAnswer ?? [];

      return {
        id: item.question_id,
        text: item.question_text, // HTML с тегами
        timeSeconds: item.time_seconds,
        options: item.options?.allAnswer ?? [],
        userAnswers,
        correctAnswers,
      };
    });

      runInAction(() => {
        this.loading = false;
      });

      return {
        result: data,
        testName,
        userName,
        percentage,
        completedAt,
        questions,
        error: null,
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ?? error?.message ?? "Ошибка при загрузке результата";

      runInAction(() => {
        this.error = message;
        this.loading = false;
      });

      return {
        error: message,
        result: null,
        testName: "",
        userName: "",
        percentage: 0,
        completedAt: null,
        questions: [],
      };
    }
  };
}
