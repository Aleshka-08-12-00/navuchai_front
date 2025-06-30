import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, putData } from '../api';

export default class AnalyticsStore {

    error: string = '';
    analyticsViews: any[] = [];
    loadingViews: boolean = false;
    
    constructor() {
        makeAutoObservable(this);
    }

    getAnalyticsFile = async (view_name: string, onSuccess?: (fileName: string) => void) => {
        try {
            // Запрашиваем файл как Blob
            const response = await fetchData('getAnalytics', {}, view_name, { responseType: 'blob' });
            const blob = response instanceof Blob ? response : new Blob([response]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analytics.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            if (onSuccess) onSuccess('analytics.xlsx');
        } catch (error) {
            this.error = 'Ошибка при скачивании файла';
        }
    }

    getAnalyticsViews = async () => {
        this.loadingViews = true;
        this.error = '';
        try {
            const result = await fetchData('getAnalyticsViews');
            if (Array.isArray(result)) {
                this.analyticsViews = result;
            } else {
                this.analyticsViews = [];
            }
        } catch (e: any) {
            this.error = e?.message || 'Ошибка загрузки видов аналитики';
            this.analyticsViews = [];
        } finally {
            this.loadingViews = false;
        }
    }

}
