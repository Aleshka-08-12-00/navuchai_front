import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, putData } from '../api';
import { IRespondentLists, IUsers } from '../interface/interfaceStore';

export default class RespondentsStore {

    error: string = '';
    respondentListsArray: IRespondentLists[] = [];
    usersArray: IUsers[] = [];
    respondentListInfo: IRespondentLists | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    getRespondentLists = async () => {
        const result = await fetchData('getUserGroups', {});
        if (result)
            this.setRespondentLists(result)
    }

    setRespondentLists = (value: IRespondentLists[]) => {
        this.respondentListsArray = value
    }

    getUsers = async () => {
        const result = await fetchData('getUsers', {});
        if (result)
            this.setUsers(result)
    }

    getUserGroupsById = async (id: string) => {
        const result = await fetchData('getUserGroupsById', {}, id);
        if (result)
            this.setRespondentListInfo(result)
    }

    setRespondentListInfo = (value: IRespondentLists) => {
        this.respondentListInfo = value;
    }

    setUsers = (value: IUsers[]) => {
        this.usersArray = value
    }

     postUsersIntoList = async (group_id: number, user_id: number) => {
            try {
                    const response = await fetch(`http://172.16.0.97:8012/api/user-groups/${group_id}/members/${user_id}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
            } catch (error) {
                console.error('Error creating question:', error);
                alert('Ошибка при создании вопроса');
            }
        }
   
}
