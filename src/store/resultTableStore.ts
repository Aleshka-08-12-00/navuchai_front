// resultTableStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { fetchData } from "../api/index";
import {
  ITestResultCreateResponse,
  IUserTestResultRow,
} from "../interface/interfaceStore";
import authStore from "./authStore";
import settingsNewTestStore from "./settingsNewTestStore";

class ResultTableStore {
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  resultsArray: ITestResultCreateResponse[] = [];
  testNamesMap = new Map<number, string>();

  constructor() {
    makeAutoObservable(this);
  }

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

  setResultsArray = async (value: ITestResultCreateResponse[]) => {
    this.resultsArray = value;
    const uniqueTestIds = [...new Set(value.map((res) => res.test_id))];
    await Promise.all(uniqueTestIds.map((id) => this.fetchAndStoreTestName(id)));
  };

  getFormattedUserResults = (): IUserTestResultRow[] => {
    return this.resultsArray.map((result) => {
      const testName = this.testNamesMap.get(result.test_id) || "Загрузка...";
      return {
        key: result.id.toString(),
        test_name: testName,
        name: authStore.name || "—",
        email: authStore.email || "—",
        total_score: result.result.percentage,
        end_date: result.completed_at
          ? new Date(result.completed_at).toLocaleString()
          : "—",
        test_time: "—",
      };
    });
  };

  getResultByResultId = async (result_id: number) => {
    try {
      const resultOfTest = await fetchData('getResultByResultId', {}, result_id);
      if(resultOfTest) {
        runInAction(() => {
          alert(resultOfTest);
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки результатов";
      });
    }
  }
}

const resultTableStore = new ResultTableStore();
export default resultTableStore;
