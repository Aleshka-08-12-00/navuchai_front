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
import Store from './store/store';
import authStore from './store/authStore';
import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import SettingsStore from './store/settingsStore';
import MainPageStore from './store/mainPageStore';
import SettingsNewTestStore from './store/settingsNewTestStore';
import CreateQuestionsStore from './store/createQuestionsStore';
import TestQuestionListPageStore from './store/testQuestionListPageStore';
import QuestionsStore from './store/questionsStore';
import TestResultStore from './store/testResultStore';
import UserAnswerStore from './store/userAnswerStore';
import resultTableStore from './store/resultTableStore';




const store = new Store();
const settingsStore = new SettingsStore();
const mainPageStore = new MainPageStore();
const settingsNewTestStore = new SettingsNewTestStore();
const createQuestionsStore  = new CreateQuestionsStore();
const testQuestionListPageStore  = new TestQuestionListPageStore();
const questionsStore = new QuestionsStore();
const testResultStore = new TestResultStore();
const userAnswerStore = new UserAnswerStore();



const obStore = {
  store,
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
}

export const Context = createContext(obStore);

const root = ReactDOM.createRoot(document.getElementById('root')!);

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <Context.Provider value={obStore}>
    <App />
  </Context.Provider>
);


