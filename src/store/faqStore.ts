import { makeAutoObservable, runInAction } from 'mobx';
import { IFaq, IFaqCategory } from '../interface/interfaceStore';
import {
  getFaqCategories,
  postFaqCategory,
  putFaqCategory,
  deleteFaqCategory,
  getFaqs,
  postFaq,
  putFaqAnswer
} from '../api';

export default class FaqStore {
  categories: IFaqCategory[] = [];
  faqs: IFaq[] = [];
  loadingCategories = false;
  loadingFaqs = false;
  error = '';

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCategories(force = false) {
    if (this.loadingCategories) return;
    if (!force && this.categories.length > 0) return;
    this.loadingCategories = true;
    try {
      const data = await getFaqCategories();
      runInAction(() => {
        this.categories = data;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message ?? 'Ошибка при загрузке категорий';
      });
    } finally {
      this.loadingCategories = false;
    }
  }

  async createCategory(data: Omit<IFaqCategory, 'id'>) {
    try {
      await postFaqCategory(data);
      await this.fetchCategories(true);
    } catch (e: any) {
      this.error = e.message ?? 'Ошибка при создании категории';
    }
  }

  async updateCategory(id: number, data: Partial<IFaqCategory>) {
    try {
      await putFaqCategory(id, data);
      await this.fetchCategories(true);
    } catch (e: any) {
      this.error = e.message ?? 'Ошибка при обновлении категории';
    }
  }

  async removeCategory(id: number) {
    try {
      await deleteFaqCategory(id);
      await this.fetchCategories(true);
    } catch (e: any) {
      this.error = e.message ?? 'Ошибка при удалении категории';
    }
  }

  async fetchFaqs(categoryId?: number, force = false) {
    if (this.loadingFaqs) return;
    if (!force && this.faqs.length > 0 && categoryId === undefined) return;
    this.loadingFaqs = true;
    try {
      const data = await getFaqs(categoryId);
      runInAction(() => {
        this.faqs = data;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message ?? 'Ошибка при загрузке FAQ';
      });
    } finally {
      this.loadingFaqs = false;
    }
  }

  async createFaq(data: { category_id: number; question: string }) {
    try {
      await postFaq(data);
      await this.fetchFaqs(data.category_id, true);
    } catch (e: any) {
      this.error = e.message ?? 'Ошибка при создании вопроса';
    }
  }

  async answerFaq(id: number, data: { answer: string; active?: boolean }) {
    try {
      await putFaqAnswer(id, data);
      await this.fetchFaqs(undefined, true);
    } catch (e: any) {
      this.error = e.message ?? 'Ошибка при ответе на вопрос';
    }
  }
}
