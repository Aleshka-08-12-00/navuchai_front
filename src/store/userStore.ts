import { makeAutoObservable, runInAction } from "mobx";
import { fetchData } from "../api";

class UserStore {
  usersMap = new Map<number, { id: number; name: string; email: string }>();
  loading = false;
  error = "";

  constructor() {
    makeAutoObservable(this);
  }

  getUserInfo = async (user_id: number) => {
    if (this.usersMap.has(user_id)) return;

    try {
      const result = await fetchData("getUserById", {}, user_id);
      if (result) {
        runInAction(() => {
          this.usersMap.set(user_id, result);
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Ошибка загрузки пользователя";
      });
    }
  };

  getUserField = (user_id: number, field: "name" | "email") => {
    const user = this.usersMap.get(user_id);
    return user ? user[field] : "Загрузка...";
  };
}

const userStore = new UserStore();
export default userStore;
