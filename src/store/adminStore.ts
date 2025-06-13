import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, postData, putData } from '../api';
import { ILoginUser, IRegisterUser, IRoles, IUsers } from '../interface/interfaceStore';

export default class AdminStore {
  error: string = '';
  userArray: IUsers[] = [];
  rolesArray: IRoles[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async () => {
    this.loading = true;
    try {
      const result = await fetchData('getUsers', {});
      if (result)
        this.setUsers(result)
    } catch (error) {
      this.error = 'Ошибка при загрузке пользователей';
    } finally {
      this.loading = false;
    }
  }

  getRoles = async () => {
    try {
      const result = await fetchData('getRoles', {});
      if (result)
        this.setRoles(result)
    } catch (error) {
      this.error = 'Ошибка при загрузке ролей';
    }
  }

  deleteUserById = async (id: number) => {
    try {
      const result = await deleteData('deleteUserById', {}, id);
      if (result)
        this.getUsers()
    } catch (error) {
      this.error = 'Ошибка при удалении пользователя';
      throw error;
    }
  }

  putUserRoleById = async (id: number, role_code: string) => {
    console.log('AdminStore: putUserRoleById called with id:', id, 'role_code:', role_code)
    try {
      const result = await putData('putUserRoleById', { role_code: role_code }, id);
      console.log('AdminStore: putData result:', result)
      if (result) {
        console.log('AdminStore: Refreshing users list')
        this.getUsers()
      }
    } catch (error) {
      console.error('AdminStore: Error in putUserRoleById:', error)
      this.error = 'Ошибка при изменении роли пользователя';
      throw error;
    }
  }

  //   postTestCategories = async (value: string) => {
  //       const result = await postData('postCategories', { name: value });
  //       if (result)
  //           alert('новая категория создана')
  //       this.getTestCategories()
  //   }

  //   getTestById = async (id: number) => {
  //       const result = await fetchData('getTestsById', {}, id);
  //       if (result)
  //           this.setTestById(result)
  //   }

  setUsers = (value: IUsers[]) => {
    this.userArray = value
  }

  setRoles = (value: IRoles[]) => {
    this.rolesArray = value
  }

  //   getLocales = async () => {
  //       const result = await fetchData('getLocales', {});
  //       if (result)
  //           this.setLocales(result)
  //   }

  //   setTestCategories = (value: ITestCategories[]) => {
  //       this.testCategories = value
  // }

}
