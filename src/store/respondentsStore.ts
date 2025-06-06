import { makeAutoObservable } from 'mobx';
import { deleteData, fetchData, postData, putData } from '../api';
import { IRespondentLists, IUsers } from '../interface/interfaceStore';

export default class RespondentsStore {

    error: string = '';
    respondentListsArray: IRespondentLists[] = [];
    usersArray: IUsers[] = [];
    respondentListInfo: IRespondentLists | null = null;
    onAlert?: (message: string, severity: 'success' | 'error') => void;

    constructor(onAlert?: (message: string, severity: 'success' | 'error') => void) {
        makeAutoObservable(this);
        this.onAlert = onAlert;
    }

    getRespondentLists = async () => {
        const result = await fetchData('getUserGroups', {});
        if (result)
            this.setRespondentLists(result)
    }

    postUserGroups = async (data: any) => {
        const result = await postData('postUserGroups', data);
        if (result) {
            const currentUrl = window.location.href;
            const updatedUrl = currentUrl.replace('/new', `/${result.id}`);
            window.history.replaceState(null, '', updatedUrl); // Меняем URL в браузере без перезагрузки
            this.getUserGroupsById(result.id);
        }
    }

    deleteUserGroupsById = async (id: string | number) => {
        const result = await deleteData('deleteUserGroupsById', {}, id);
        if (result) {
            this.getRespondentLists()
        }
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

    putUserGroupsById = async (data: any, id: string) => {
        const result = await putData('putUserGroupsById', data, id);
        if (result) {
            if (this.onAlert) {
                this.onAlert('Данные изменены', 'success');
            }
            this.getUserGroupsById(id);
        }
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

            if (response) {
                this.getUserGroupsById(String(group_id));
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error creating question:', error);
            if (this.onAlert) {
                this.onAlert('Ошибка при создании вопроса', 'error');
            }
        }
    }

    deleteUsersFromList = async (group_id: number, user_id: number) => {
        try {
            const response = await fetch(`http://172.16.0.97:8012/api/user-groups/${group_id}/members/${user_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tokenNavuchai')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response) {
                this.getUserGroupsById(String(group_id));
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error creating question:', error);
            if (this.onAlert) {
                this.onAlert('Ошибка при создании вопроса', 'error');
            }
        }
    }
}
