import { makeAutoObservable } from "mobx";

interface DataType {
  key: React.Key;
  test_name: string;
  last_name: string;
  first_name: string;
  total_score: number;
  end_date: string;
  test_time: string;
}

export default class Store {
  count: number = 3;
  searchQuery: string = "";
  selectedUser: DataType | null = null;

  dataSource: DataType[] = [
    { key: 1, test_name: "Математика", last_name: "Иванов", first_name: "Алексей", total_score: 85, end_date: "2025-03-25", test_time: "14:30" },
    { key: 2, test_name: "Физика", last_name: "Петров", first_name: "Дмитрий", total_score: 92, end_date: "2025-03-24", test_time: "10:15" },
    { key: 3, test_name: "Химия", last_name: "Сидоров", first_name: "Максим", total_score: 78, end_date: "2025-03-23", test_time: "12:00" },
    { key: 4, test_name: "Биология", last_name: "Козлов", first_name: "Артем", total_score: 88, end_date: "2025-03-22", test_time: "09:45" },
    { key: 5, test_name: "Информатика", last_name: "Морозов", first_name: "Иван", total_score: 95, end_date: "2025-03-21", test_time: "16:20" },
    { key: 6, test_name: "История", last_name: "Васильев", first_name: "Олег", total_score: 5, end_date: "2025-03-20", test_time: "11:10" },
    { key: 7, test_name: "География", last_name: "Зайцев", first_name: "Егор", total_score: 76, end_date: "2025-03-19", test_time: "15:40" },
    { key: 8, test_name: "Английский язык", last_name: "Новиков", first_name: "Андрей", total_score: 49, end_date: "2025-03-18", test_time: "13:25" },
    { key: 9, test_name: "Французский язык", last_name: "Белов", first_name: "Никита", total_score: 51, end_date: "2025-03-17", test_time: "08:30" },
    { key: 10, test_name: "Литература", last_name: "Романов", first_name: "Владимир", total_score: 50, end_date: "2025-03-16", test_time: "10:50" },
    { key: 11, test_name: "Экономика", last_name: "Тимофеев", first_name: "Григорий", total_score: 11, end_date: "2025-03-15", test_time: "14:00" },
    { key: 12, test_name: "Право", last_name: "Федоров", first_name: "Сергей", total_score: 87, end_date: "2025-03-14", test_time: "17:10" },
    { key: 13, test_name: "Социология", last_name: "Александров", first_name: "Роман", total_score: 70, end_date: "2025-03-13", test_time: "09:00" },
    { key: 14, test_name: "Философия", last_name: "Дмитриев", first_name: "Павел", total_score: 12, end_date: "2025-03-12", test_time: "15:30" },
    { key: 15, test_name: "Логика", last_name: "Гаврилов", first_name: "Денис", total_score: 77, end_date: "2025-03-11", test_time: "11:45" },
    { key: 16, test_name: "Психология", last_name: "Орлов", first_name: "Илья", total_score: 23, end_date: "2025-03-10", test_time: "16:55" },
    { key: 17, test_name: "Физкультура", last_name: "Крылов", first_name: "Антон", total_score: 96, end_date: "2025-03-09", test_time: "13:15" },
    { key: 18, test_name: "Черчение", last_name: "Борисов", first_name: "Виталий", total_score: 73, end_date: "2025-03-08", test_time: "12:30" },
    { key: 19, test_name: "Труд", last_name: "Макаров", first_name: "Евгений", total_score: 85, end_date: "2025-03-07", test_time: "09:50" },
    { key: 20, test_name: "Русский язык", last_name: "Николаев", first_name: "Кирилл", total_score: 88, end_date: "2025-03-06", test_time: "14:05" },
    { key: 21, test_name: "Математика", last_name: "Семенов", first_name: "Аркадий", total_score: 81, end_date: "2025-03-05", test_time: "10:35" },
    { key: 22, test_name: "Физика", last_name: "Захаров", first_name: "Вячеслав", total_score: 90, end_date: "2025-03-04", test_time: "08:20" },
    { key: 23, test_name: "Химия", last_name: "Тихонов", first_name: "Владислав", total_score: 43, end_date: "2025-03-03", test_time: "15:50" },
    { key: 24, test_name: "Биология", last_name: "Беляев", first_name: "Степан", total_score: 92, end_date: "2025-03-02", test_time: "11:25" },
    { key: 25, test_name: "Информатика", last_name: "Богданов", first_name: "Альберт", total_score: 97, end_date: "2025-03-01", test_time: "17:40" },
    { key: 26, test_name: "История", last_name: "Денисов", first_name: "Юрий", total_score: 86, end_date: "2025-02-29", test_time: "13:10" },
    { key: 27, test_name: "География", last_name: "Фомин", first_name: "Тимур", total_score: 74, end_date: "2025-02-28", test_time: "12:45" },
    { key: 28, test_name: "Английский язык", last_name: "Громов", first_name: "Константин", total_score: 91, end_date: "2025-02-27", test_time: "09:15" },
    { key: 29, test_name: "Французский язык", last_name: "Ершов", first_name: "Оскар", total_score: 87, end_date: "2025-02-26", test_time: "10:55" },
    { key: 30, test_name: "Литература", last_name: "Михайлов", first_name: "Станислав", total_score: 83, end_date: "2025-02-25", test_time: "14:45" }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  get filteredData() {
    if (!this.searchQuery) return this.dataSource;
    return this.dataSource.filter((item) =>
      item.test_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getTimeInSeconds(timeString: string): number {
    if (!timeString) return 0; // Защита от undefined/null

    // Если строка времени не содержит секунды, добавляем ":00"
    const normalizedTime = timeString.length === 5 ? `${timeString}:00` : timeString;

    const timeParts = normalizedTime.split(':').map(part => parseInt(part, 10));

    if (timeParts.length !== 3 || timeParts.some(isNaN)) {
        console.error("Некорректный формат времени:", timeString);
        return 0;
    }

    const [hours, minutes, seconds] = timeParts;
    return hours * 3600 + minutes * 60 + seconds;
}

  setSelectedUser(user: DataType) {
    this.selectedUser = user;
  }
}

export const store = new Store();
