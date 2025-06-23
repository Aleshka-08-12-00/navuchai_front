import { makeAutoObservable } from 'mobx';
import { IGroupMember, IRespondentLists, IUsers } from '../interface/interfaceStore';
import { fetchData, postData, deleteData } from '../api';


export default class AccessTestToUserStore {
  groupMembers: IGroupMember[] = [];
  usersArray: IUsers[] = [];
  accessUsersArray: IUsers[] = [];
  accessGroupsArray: any = [];
  respondentListsArray: IRespondentLists[] = [];
  loadingUsers = false;
  loadingAccessUsers = false;
  loadingAccessGroups = false;
  loadingRespondentLists = false;

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async (force = false) => {
    if (this.loadingUsers) return;
    if (!force && this.usersArray.length > 0) return;
    this.loadingUsers = true;
    const result = await fetchData('getUsers', {});
    if (result)
      this.setUsers(result)
    this.loadingUsers = false;
  }

  getAccessUsers = async (test_id: number | null, force = false) => {
    if (this.loadingAccessUsers) return;
    if (!force && this.accessUsersArray.length > 0) return;
    this.loadingAccessUsers = true;
    const result = await fetchData('getUsersInTest', {}, test_id );
    if (result)
      this.setAccessUsers(result)
    this.loadingAccessUsers = false;
  }

  getAccessGroups = async (test_id: number | null, force = false) => {
    if (this.loadingAccessGroups) return;
    if (!force && this.accessGroupsArray.length > 0) return;
    this.loadingAccessGroups = true;
    const result = await fetchData('getGroupsInTest', {}, test_id );
    if (result)
      this.setAccessGroups(result)
    this.loadingAccessGroups = false;
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
      // Обновляем данные после добавления
      if (test_id) {
        this.getAccessGroups(test_id, true);
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
      // Обновляем данные после добавления
      if (test_id) {
        this.getAccessUsers(test_id, true);
      }
    }
  }

  deleteUserFromTest = async (test_id: number | null, user_id: number | null) => {
    
    const result = await deleteData('deleteUserInTest', {}, `${test_id}/${user_id}`);
    if (result) {
      // Обновляем данные после удаления
      if (test_id) {
        this.getAccessUsers(test_id, true);
      }
    }
  }

  deleteGroupFromTest = async (test_id: number | null, group_id: number | null) => {
    const result = await deleteData('deleteGroupInTest', {}, `${test_id}/${group_id}`);
    if (result) {
      // Обновляем данные после удаления
      if (test_id) {
        this.getAccessGroups(test_id, true);
      }
    }
  }

  setUsers = (value: IUsers[]) => {
    this.usersArray = value
  }

  setAccessUsers = (value: IUsers[]) => {
    this.accessUsersArray = value
  }

  getRespondentLists = async (force = false) => {
    if (this.loadingRespondentLists) return;
    if (!force && this.respondentListsArray.length > 0) return;
    this.loadingRespondentLists = true;
    const result = await fetchData('getUserGroups', {});
    if (result)
      this.setRespondentLists(result)
    this.loadingRespondentLists = false;
  }

  setRespondentLists = (value: IRespondentLists[]) => {
    this.respondentListsArray = value
  }

}

