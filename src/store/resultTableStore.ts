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
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  resultsArray: ITestResultCreateResponse[] = [];
  testNamesMap = new Map<number, string>();
  selectedResult: ITestResultCreateResponse | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Загрузка названия теста по ID и кэширование
  fetchAndStoreTestName = async (testId: number) => {
    if (this.testNamesMap.has(testId)) return;

    await settingsNewTestStore.getTestById(testId);
    const test = settingsNewTestStore.testMainInfo;
    if (test?.id === testId && test.title) {
      this.testNamesMap.set(testId, test.title);
    } else {
      this.testNamesMap.set(testId, "Неизвестно");
    }
  };

  // Загрузка всех результатов и имен/емейлов
  getResults = async () => {
    this.loading = true;
    this.error = null;

    try {
      const result = await fetchData("getResults");
      if (result) {
        await this.setResultsArray(result);
      }
      runInAction(() => {
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки результатов";
        this.loading = false;
      });
    }
  };

  // Кэшируем тесты и пользователей
  setResultsArray = async (value: ITestResultCreateResponse[]) => {
    this.resultsArray = value;

    const uniqueTestIds = [...new Set(value.map((res) => res.test_id))];
    const uniqueUserIds = [...new Set(value.map((res) => res.user_id))];

    // Параллельная загрузка
    await Promise.all([
      ...uniqueTestIds.map((id) => this.fetchAndStoreTestName(id)),
      ...uniqueUserIds.map((id) => userStore.getUserById(id)),
    ]);
  };

  // Формирование строки для таблицы
  getFormattedUserResults = (): IUserTestResultRow[] => {
    return this.resultsArray.map((result) => {
      const testName = this.testNamesMap.get(result.test_id) || "Загрузка...";
      const name = userStore.getUserField(result.user_id, "name");
      const email = userStore.getUserField(result.user_id, "email");

      return {
        key: result.id.toString(),
        test_name: testName,
        name,
        email,
        total_score: result.result?.percentage ?? undefined,
        end_date: result.completed_at
          ? new Date(result.completed_at).toLocaleString()
          : "—",
        test_time: "—", // если нужно — можешь добавить расчет времени здесь
      };
    });
  };

  // Получение результата по ID (если нужно)
  getResultByResultId = async (resultId: number) => {

    if (!resultId || isNaN(resultId)) {
      console.error("Неверный resultId:", resultId);
      return null;
    }

    this.loading = true;
    try {
      const data = await fetchData('getResultByResultId', {}, resultId);
      runInAction(() => {
        this.selectedResult = data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка при загрузке результата";
        this.loading = false;
      });
    }
  };

  getInfoByIdResultTest = async (resultId: number) => {
    this.loading = true;
    this.error = null;
    try {
      const data = await fetchData('getResultByResultId', {}, resultId);
      runInAction(() => {
        this.selectedResult = data;
      });

      const testId = data?.test_id;
      const userId = data?.user_id;
      const percentage = data?.result?.percentage;
      const completedAt = data?.completed_at;
      

      await Promise.all([
        testId ? this.fetchAndStoreTestName(testId) : Promise.resolve(),
        userId ? userStore.getUserById(userId) : Promise.resolve(),
        console.log(`${percentage} и ${completedAt}`),
      ]);

      const testName = testId ? this.testNamesMap.get(testId) : "Неизвестно";
      const userName = userId ? userStore.getUserField(userId, "name") : "Неизвестно";

    // Обработка массива вопросов для таблицы
    const checkedAnswers = data?.result?.checked_answers || [];

    const questions = checkedAnswers.map((answer: ICheckedAnswer, index: number) => {
      const questionText = answer.question_text;
      const correctAnswers = answer.check_details.correct_answer || [];

      let userAnswers: string[] = [];

      try {
        const rawAnswer = answer.check_details?.details?.user_choice?.answer ?? '';
        const parsed = JSON.parse(rawAnswer);
        userAnswers = Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch {
        const fallback = answer.check_details?.details?.user_choice?.answer ?? '';
        userAnswers = fallback ? [fallback] : [];
      }

      const allAnswers = Array.from(new Set([
        ...correctAnswers,
        ...userAnswers,
        ...([]) // Массив из всех вариантов ответа на вопрос
      ]));

      const options = allAnswers.map((text, i) => ({
        id: i,
        text,
        isCorrect: correctAnswers.includes(text),
      }));

      const userAnswerIds = options
        .filter(opt => userAnswers.includes(opt.text))
        .map(opt => opt.id);

      return {
        question: `Вопрос №${index + 1}`,
        title: questionText,
        timeSpent: '—',
        description: questionText,
        options,
        userAnswerIds,
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
      const message = error?.response?.data?.detail || error.message || "Ошибка при загрузке результата";

      runInAction(() => {
        this.error = message;
        this.loading = false;
      });

      return {
        error: message,
        result: null,
        testName: '',
        userName: '',
        percentage: 0,
        completedAt: null,
        questions: [],
      };
    }
  };
}

