import { makeAutoObservable } from "mobx";
import { fetchData } from "../api/index";
import {
  ITestResultCreateResponse,
  IUserTestResultRow,
} from "../interface/interfaceStore";
import authStore from "./authStore";


class ResultTableStore {
  result: ITestResultCreateResponse | null = null;
  loading = false;
  error: string | null = null;
  resultsByUserIdArray : ITestResultCreateResponse[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getResultByUser = async (user_id: number) => {
    const result = await fetchData('getResultsByUserId', {}, user_id)
    if(result) {
        this.setResultsArrays(result)
    }
  }

    setResultsArrays = (value: ITestResultCreateResponse[]) => {
        this.resultsByUserIdArray = value
        alert('Результаты загружены')
    }

        getFormattedUserResults = (): IUserTestResultRow[] => {
        return this.resultsByUserIdArray.map((result, index) => ({
            key: result.id.toString(),
            test_name: "Неизвестно", // если `test_name` есть
            name: authStore.name || "—",
            email: authStore.email || "—",
            total_score: result.score,
            end_date: new Date(result.completed_at).toLocaleDateString(),
            test_time: "—",
        }));
    };
}

export const resultTableStore = new ResultTableStore();
export default resultTableStore;
