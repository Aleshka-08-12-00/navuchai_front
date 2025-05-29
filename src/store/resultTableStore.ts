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
  resultsByUserIdArray: ITestResultCreateResponse[] = [];
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

    getResultByUser = async (user_id: number) => {
    this.loading = true;
    this.error = null;
    try {
        const result = await fetchData("getResultsByUserId", {}, user_id);
        if (result) {
        await this.setResultsArrays(result); // <–– обязательно жди
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

    setResultsArrays = async (value: ITestResultCreateResponse[]) => {
        this.resultsByUserIdArray = value;

        const uniqueTestIds = [...new Set(value.map((res) => res.test_id))];
        await Promise.all(uniqueTestIds.map((testId) => this.fetchAndStoreTestName(testId)));
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

  getFormattedUserResults = (): IUserTestResultRow[] => {
    return this.resultsByUserIdArray.map((result) => {
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
};


export const resultTableStore = new ResultTableStore();
export default resultTableStore;
