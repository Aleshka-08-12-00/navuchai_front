// scroll bar
import 'simplebar-react/dist/simplebar.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// project import
import App from './App';
import authStore from './store/authStore';
import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import SettingsStore from './store/settingsStore';
import MainPageStore from './store/mainPageStore';
import CreateQuestionsStore from './store/createQuestionsStore';
import TestQuestionListPageStore from './store/testQuestionListPageStore';
import TestResultStore from './store/testResultStore';
import UserAnswerStore from './store/userAnswerStore';
import settingsNewTestStore from './store/settingsNewTestStore';
import userStore from './store/userStore';
import ProfileStore from './store/profileStore';
import ResultTableStore from './store/resultTableStore';
import RespondentsStore from './store/respondentsStore';
import questionsStore from './store/questionsStore';
import AdminStore from './store/adminStore';
import AccessTestToUserStore from './store/accessTestToUserStore';
import AnalyticsStore from './store/analyticsStore';

const showAlert = (message: string, severity: 'success' | 'error') => {
  // This will be implemented by each component that needs alerts
  console.log(`${severity}: ${message}`);
};

const settingsStore = new SettingsStore();
const mainPageStore = new MainPageStore();
const createQuestionsStore = new CreateQuestionsStore(showAlert);
const testQuestionListPageStore = new TestQuestionListPageStore(showAlert);
const testResultStore = new TestResultStore();
const userAnswerStore = new UserAnswerStore();
const profileStore = new ProfileStore(showAlert);
const resultTableStore = new ResultTableStore();
const respondentsStore = new RespondentsStore(showAlert);
const adminStore = new AdminStore();
const accessTestToUserStore = new AccessTestToUserStore();
const analyticsStore = new AnalyticsStore();


const obStore = {
  authStore,
  settingsStore,
  mainPageStore,
  settingsNewTestStore,
  createQuestionsStore,
  testQuestionListPageStore,
  questionsStore,
  testResultStore,
  userAnswerStore,
  resultTableStore,
  userStore,
  profileStore,
  respondentsStore,
  adminStore,
  accessTestToUserStore,
  analyticsStore
}

export const Context = createContext(obStore);

const root = ReactDOM.createRoot(document.getElementById('root')!);

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <Context.Provider value={obStore}>
    <App />
  </Context.Provider>
);


