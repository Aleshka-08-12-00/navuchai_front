import { makeAutoObservable } from "mobx";
import {
  ITestResultAnswerPayload,
  ITestResultAnswerRequest,
  ITestResultCreateRequest,
} from "../interface/interfaceStore";

export default class UserAnswerStore {
  answers: ITestResultAnswerRequest[] = [];
  userId: number | null = null;
  testId: number | null = null;
  score: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setUserId(id: number) {
    this.userId = id;
  }

  setTestId(id: number) {
    this.testId = id;
  }

  setScore(score: number) {
    this.score = score;
  }

  saveAnswer(questionId: number, answer: ITestResultAnswerPayload) {
    const existingIndex = this.answers.findIndex(
      (ans) => ans.question_id === questionId
    );

    const payload: ITestResultAnswerRequest = {
      question_id: questionId,
      answer: answer, // <-- передаём напрямую
    };

    if (existingIndex !== -1) {
      this.answers[existingIndex] = payload;
    } else {
      this.answers.push(payload);
    }
  }


    getPayload(): ITestResultCreateRequest | null {
    console.log("getPayload called");
    console.log("userId:", this.userId);
    console.log("testId:", this.testId);
    console.log("score:", this.score);
    console.log("answers:", this.answers);

    if (this.userId === null) {
        console.warn("getPayload: userId is null");
        return null;
    }
    if (this.testId === null) {
        console.warn("getPayload: testId is null");
        return null;
    }

    if (this.answers.length === 0) {
        console.warn("getPayload: answers array is empty");
    }

    return {
        user_id: this.userId,
        test_id: this.testId,
        score: this.score,
        answers: this.answers,
    };
    }

  reset() {
    this.answers = [];
    this.testId = null;
    this.userId = null;
    this.score = 0;
  }
}
