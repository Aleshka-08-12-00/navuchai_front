import { makeAutoObservable } from 'mobx';



export default class Store {
  count: number = 3




  constructor() {
    makeAutoObservable(this);
  }


 

}
