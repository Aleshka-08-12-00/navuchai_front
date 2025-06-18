import { makeAutoObservable } from 'mobx';
import { IGroupMember, IRespondentLists, IUsers } from '../interface/interfaceStore';
import { fetchData, postData, deleteData } from '../api';


export default class AccessTestToUserStore {
  groupMembers: IGroupMember[] = [];
  usersArray: IUsers[] = [];
  accessUsersArray: IUsers[] = [];
  accessGroupsArray: any = [];
  respondentListsArray: IRespondentLists[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async () => {
    const result = await fetchData('getUsers', {});
    if (result)
      this.setUsers(result)
  }

  getAccessUsers = async (test_id: number | null) => {
    const result = await fetchData('getUsersInTest', {}, test_id );
    if (result)
      this.setAccessUsers(result)
  }

  getAccessGroups = async (test_id: number | null) => {
    const result = await fetchData('getGroupsInTest', {}, test_id );
    if (result)
      this.setAccessGroups(result)
  }

  setAccessGroups = (value: any) => {
    this.accessGroupsArray = value
  }

  postGroupToTest = async (test_id: number | null, group_id: number | null) => {
   
    let data={
      test_id: test_id,
      group_id: group_id,
    }
    
    const result = await postData('postGroupToTest', data);
    if (result) {
      console.log(result)
      alert('Группа добавлена в тест')
      // Обновляем данные после добавления
      if (test_id) {
        this.getAccessGroups(test_id);
      }
    }
  }

  postUserToTest = async (test_id: number | null, user_id: number | null) => {
  
    let data={
      test_id: test_id,
      user_id: user_id,
    }

    
    const result = await postData('postUserToTest', data);
    if (result) {
      console.log(result)
      alert('Пользователь добавлен в тест')
      // Обновляем данные после добавления
      if (test_id) {
        this.getAccessUsers(test_id);
      }
    }
  }

  deleteUserFromTest = async (test_id: number | null, user_id: number | null) => {
    
    const result = await deleteData('deleteUserInTest', {}, `${test_id}/${user_id}`);
    if (result) {
      console.log(result)
      alert('Пользователь удален из теста')
      // Обновляем данные после удаления
      if (test_id) {
        this.getAccessUsers(test_id);
      }
    }
  }

  deleteGroupFromTest = async (test_id: number | null, group_id: number | null) => {
    const result = await deleteData('deleteGroupInTest', {}, `${test_id}/${group_id}`);
    if (result) {
      console.log(result)
      alert('Группа удалена из теста')
      // Обновляем данные после удаления
      if (test_id) {
        this.getAccessGroups(test_id);
      }
    }
  }

  setUsers = (value: IUsers[]) => {
    this.usersArray = value
  }

  setAccessUsers = (value: IUsers[]) => {
    this.accessUsersArray = value
  }

  getRespondentLists = async () => {
    const result = await fetchData('getUserGroups', {});
    if (result)
      this.setRespondentLists(result)
  }

  setRespondentLists = (value: IRespondentLists[]) => {
    this.respondentListsArray = value
  }

}

