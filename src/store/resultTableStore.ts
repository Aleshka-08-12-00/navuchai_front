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
    a.download = "results.xlsx"; // Или любое другое имя по умолчанию
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    runInAction(() => {
      this.error = error.message || "Ошибка загрузки результатов";
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
    const name = test?.title || "Неизвестно";

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
        this.error = error.message || "Ошибка загрузки результатов";
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

    const uniqueTestIds = Array.from(new Set(value.map((res) => res.test_id)));
    const uniqueUserIds = Array.from(new Set(value.map((res) => res.user_id)));

    await Promise.all([
      ...uniqueTestIds.map((id) => this.fetchAndStoreTestName(id)),
      ...uniqueUserIds.map((id) => userStore.getUserById(id)),
    ]);
  };

  getFormattedUserResults(): IUserTestResultRow[] {
    return this.resultsArray.map((res) => ({
      key: res.id,
      test_name: this.testNamesMap.get(res.test_id) || "—",
      name: userStore.getUserField(res.user_id, "name") || "",
      email: userStore.getUserField(res.user_id, "email") || "",
      percentage: res.result?.percentage || 0,
      end_date: new Date(res.completed_at).toLocaleString(),
      test_time: this.formatTime(res.result?.total_time_seconds || 0),
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
        this.error = error.message || "Ошибка при загрузке результата";
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
      const percentage = result?.percentage || 0;
      const completedAt = data?.completed_at || null;

      await Promise.all([
        testId ? this.fetchAndStoreTestName(testId) : Promise.resolve(),
        userId ? userStore.getUserById(userId) : Promise.resolve(),
      ]);

      const testName = this.testNamesMap.get(testId) || "Неизвестно";
      const userName = userStore.getUserField(userId, "name") || "Неизвестно";

      const checkedAnswers: ICheckedAnswer[] = result?.checked_answers || [];
      if (testId) await questionsStore.fetchQuestionsByTestId(testId);

      // const questions = checkedAnswers.map((answer, index) => {
      //   const questionText = answer.question_text;
      //   const correctAnswers: string[] = answer.check_details.correct_answer || [];

      //   let userAnswers: string[] = [];
      //   try {
      //     const rawValue = answer.check_details?.user_answer?.value;
      //     const parsed = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;

      //     if (Array.isArray(parsed)) {
      //       userAnswers = parsed.map(String);
      //     } else if (parsed?.answer) {
      //       userAnswers = Array.isArray(parsed.answer) ? parsed.answer.map(String) : [String(parsed.answer)];
      //     } else if (typeof parsed === "string") {
      //       userAnswers = [parsed];
      //     }
      //   } catch {
      //     userAnswers = [];
      //   }

        // const matched = questionsStore.questions.find((q) => q.question.id === answer.question_id);
        // const allAnswers = matched
        //   ? matched.question.answers.allAnswer
        //   : Array.from(new Set([...correctAnswers, ...userAnswers]));

        // const options = allAnswers.map((text, i) => ({
        //   id: i,
        //   text,
        //   isCorrect: correctAnswers.includes(text),
        //   isUserAnswer: userAnswers.includes(text),
        // }));

      //   return {
      //     question: `Вопрос №${index + 1}`,
      //     title: questionText,
      //     timeSpent: 0,
      //     description: questionText,
      //     options,
      //     // correctCount: answer.check_details.details.correct_count || 1,
      //     // totalCorrect: answer.check_details.details.total_correct || 1,
      //   };
      // });

      runInAction(() => {
        this.loading = false;
      });

      return {
        result: data,
        testName,
        userName,
        percentage,
        completedAt,
        // questions,
        error: null,
      };
    } catch (error: any) {
      const message = error?.response?.data?.detail || error.message || "Ошибка при загрузке результата";

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
