import { makeAutoObservable, runInAction } from "mobx";
import { fetchData } from "../api/index";
import {
  ICheckedAnswer,
  ITestResultCreateResponse,
  IUserTestResultRow,
} from "../interface/interfaceStore";
import settingsNewTestStore from "./settingsNewTestStore";
import userStore from "./userStore";
import questionsStore from "./questionsStore";

export default class ResultTableStore {
  resultsArray: ITestResultCreateResponse[] = [];
  testNamesMap = new Map<number, string>();
  selectedResult: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;

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
      a.download = "results.xlsx"; // Можно заменить имя файла при необходимости
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

    await settingsNewTestStore.getTestById(testId);
    const test = settingsNewTestStore.testMainInfo;
    const name = test?.title ?? "Неизвестно";

    runInAction(() => {
      this.testNamesMap.set(testId, name);
    });
  };

  getResults = async () => {
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
      });
    }
  };

  setResultsArray = async (value: ITestResultCreateResponse[]) => {
    runInAction(() => {
      this.resultsArray = value;
    });

    // Получаем уникальные test_id и user_id
    const uniqueTestIds = Array.from(new Set(value.map((res) => res.test_id)));
    const uniqueUserIds = Array.from(new Set(value.map((res) => res.user_id)));

    // Параллельно загружаем названия тестов и данные пользователей
    await Promise.all([
      ...uniqueTestIds.map((id) => this.fetchAndStoreTestName(id)),
      ...uniqueUserIds.map((id) => userStore.getUserById(id)),
    ]);
  };

  getFormattedUserResults(): IUserTestResultRow[] {
    return this.resultsArray.map((res) => ({
      key: res.id,
      test_name: this.testNamesMap.get(res.test_id) ?? "—",
      name: userStore.getUserField(res.user_id, "name") ?? "",
      email: userStore.getUserField(res.user_id, "email") ?? "",
      percentage: res.result?.percentage ?? 0,
      end_date: res.completed_at ? new Date(res.completed_at).toLocaleString() : "",
      test_time: this.formatTime(res.result?.total_time_seconds ?? 0),
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

    const stripHtml = (html: string): string => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

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

      const checkedAnswers: ICheckedAnswer[] = result?.checked_answers ?? [];
      if (testId) await questionsStore.fetchQuestionsByTestId(testId);

      const questionsMap = questionsStore.questionsObj;

      const questions = checkedAnswers.map((answer, index) => {
        const questionText = answer.question_text;

        let correctAnswers: string[] = [];
        let userAnswers: string[] = [];

        const check = answer.check_details;

        if ("correct_answer" in check && "user_answer" in check) {
          correctAnswers = [check.correct_answer];
          userAnswers = [check.user_answer];
        } else if ("correct_answers" in check && "user_answers" in check) {
          correctAnswers = check.correct_answers;
          userAnswers = check.user_answers;
        }

       const normalizeAnswer = (str: string) =>
          stripHtml(str).trim().toLowerCase();

        const normalizedCorrectAnswers = correctAnswers.map(normalizeAnswer);
        const normalizedUserAnswers = userAnswers.map(normalizeAnswer);

        const questionFromStore = questionsMap.get(answer.question_id);
        const allOptions: string[] = questionFromStore?.question?.answers?.allAnswer ?? [];

        const options = allOptions.map((text: string, i: number) => {
          const cleanText = stripHtml(text).trim();
          const normalizedText = cleanText.toLowerCase();

          return {
            id: i,
            text: cleanText,
            isCorrect: normalizedCorrectAnswers.includes(normalizedText),
            isUserAnswer: normalizedUserAnswers.includes(normalizedText),
          };
        });


        const correctCount = options.filter((opt) => opt.isCorrect).length;

        return {
          question: `Вопрос №${index + 1}`,
          title: questionText,
          timeSpent: answer.time_seconds,
          timeLimit: answer.time_limit,
          isTimeExceeded: answer.is_time_exceeded,
          options,
          isCorrect: answer.is_correct,
          correctCount,
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
        error?.response?.data?.detail ??
        error?.message ??
        "Ошибка при загрузке результата";

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
