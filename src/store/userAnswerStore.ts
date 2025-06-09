import { makeAutoObservable } from "mobx";
import {
  IAnswerValue,
  ITestResultAnswerRequest,
  ITestResultCreateRequest,
} from "../interface/interfaceStore";

export default class UserAnswerStore {
  answers: ITestResultAnswerRequest[] = [];
  userId: number | null = null;
  testId: number | null = null;
  timeStart: string | null = null;
  timeEnd: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserId(id: number) {
    this.userId = id;
  }

  setTestId(id: number) {
    this.testId = id;
  }

  setTimeStart(start: string) {
    this.timeStart = start;
  }

  setTimeEnd(end: string) {
    this.timeEnd = end;
  }

  saveAnswer(
    questionId: number,
    answer: IAnswerValue,
    timeStart: string,
    timeEnd: string
  ) {
    const existingIndex = this.answers.findIndex(
      (ans) => ans.question_id === questionId
    );

    const payload: ITestResultAnswerRequest = {
      question_id: questionId,
      time_start: timeStart,
      time_end: timeEnd,
      answer,
    };

    if (existingIndex !== -1) {
      this.answers[existingIndex] = payload;
    } else {
      this.answers.push(payload);
    }
  }

getPayload(): ITestResultCreateRequest | null {
    if (
      this.userId === null ||
      this.testId === null ||
      this.timeStart === null ||
      this.timeEnd === null
    ) {
      return null;
    }

    return {
      user_id: this.userId,
      test_id: this.testId,
      time_start: this.timeStart,
      time_end: this.timeEnd,
      answers: this.answers,
    };
  }

  reset() {
    this.answers = [];
    this.testId = null;
    this.userId = null;
    this.timeStart = null;
    this.timeEnd = null;
  }
}
