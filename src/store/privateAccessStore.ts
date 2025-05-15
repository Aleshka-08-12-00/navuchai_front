import { makeAutoObservable } from 'mobx';
import { IGroupMember } from '../interface/interfaceStore';


class TestAccessStore {
  groupMembers: IGroupMember[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  generateGroupMembers(count: number) {
    this.groupMembers = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      email: `user${index + 1}@example.com`,
      send_code: true
    }));
  }

  setSendCode(id: number, value: boolean) {
    const member = this.groupMembers.find((m) => m.id === id);
    if (member) {
      member.send_code = value;
    }
  }
}

export const testAccessStore = new TestAccessStore();
