import { makeAutoObservable } from 'mobx';
import { IGroupMember, IRespondentLists, IUsers } from '../interface/interfaceStore';
import { fetchData } from '../api';


export default class AccessTestToUserStore {
  groupMembers: IGroupMember[] = [];
  usersArray: IUsers[] = [];
  respondentListsArray: IRespondentLists[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async () => {
    const result = await fetchData('getUsers', {});
    if (result)
      this.setUsers(result)
  }

  setUsers = (value: IUsers[]) => {
    this.usersArray = value
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

