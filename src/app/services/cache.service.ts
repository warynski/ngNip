import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TaxPayerInterface } from '../models/taxpayer-interface';

@Injectable()
export class CacheService {

  constructor(private apiService: ApiService) { }

  commsMsg = new Subject();       // object forwarded to COMMS, communication with user
  outputData = new Subject();     // object forwarded to OUTPUT, data from service
  historySwitch = new Subject();  // boolean forwarded from HISTORY to SEARCH, history display switch
  enterNewData = new Subject();
  currentTaxNumberType: string;

  public getData(string: string, numberType?: string) {
    this.currentTaxNumberType = numberType;
    if (numberType === undefined) {
      this.commsMsg.next([true, false, true, 'Walidacja wyłączona. Pobieram dane.']);
    } else {
      this.commsMsg.next([true, false, true, 'Rozpoznano prawidłowy ' + numberType + '. Pobieram dane.'])
    }
    setTimeout(() => {                                              // setTimeout is only for demonstration purpose
      if (localStorage.getItem('data') == null) {
        this.getDataFromApi(string);
      } else {
        this.getDataFromCache(string);
      }
    }, 2000)
  }

  private getDataFromApi(string: string) {  // Fetches Data From Api
    console.log('Data flows form API');
    this.apiService.getData(string).subscribe(
      post => {
        this.processData(post, string);
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('Data fetched from API');
      }
    )
  }

  private processData(data: any, string: string): void {  // Communication, Sends Data To Local Storage And To Output Component
    data = data.CompanyInformation;
    if (data == null) {
      this.commsMsg.next([true, true, false, 'Brak danych'])
    } else {
      this.outputData.next(data);
      this.pushToCache(data);
      this.pushToHistory(string);
      this.commsMsg.next([false, false, false, '']);
    }
  }

  public getDataFromCache(string: string) { //  Fetches Data From Local Storage
    console.log('Data flows form cache');
    let tempArray: Array<TaxPayerInterface>;
    let tempJSON: string;
    let num: number = parseInt(string);
    let res: Object;
    tempJSON = localStorage.getItem('data');
    tempArray = JSON.parse(tempJSON);
    res = tempArray.find((elem) => elem.Regon == num || elem.Nip == num || elem.Krs == num);
    if (res !== undefined) {
      this.outputData.next(res);
      console.log(res);
      this.commsMsg.next([false, false, false, '']);
      this.pushToHistory(string);
    } else {
      this.getDataFromApi(string);
    }
  }

  private pushToCache(data): void { //  Pushes Data Of Taxpayer To Local Storage
    let tempArray: Array<Object> = [];
    let tempJSON: string;
    if (localStorage.getItem('data') === null) {
      tempArray.unshift(data);
      tempJSON = JSON.stringify(tempArray);
      localStorage.setItem('data', tempJSON);
    } else {
      tempJSON = localStorage.getItem('data');
      tempArray = JSON.parse(tempJSON);
      tempArray.unshift(data);
      tempJSON = JSON.stringify(tempArray);
      localStorage.setItem('data', tempJSON);
    }
  }

  public notValid(): void { // Sends communique
    this.commsMsg.next([true, true, false, 'Nieprawidłowy NIP/REGON/KRS']);
  }

  public pushToHistory(string): void {  // Pushes Data Of Search History To Local Storage
    let tempArray: string[] = [];
    if (localStorage.getItem('history') === null) {
      tempArray.unshift(string);
      localStorage.setItem('history', JSON.stringify(tempArray));
    } else {
      tempArray = JSON.parse(localStorage.getItem('history'));
      let res = tempArray.find((elem) => elem == string);
      if (res == undefined) {
        tempArray.unshift(string);
        localStorage.setItem('history', JSON.stringify(tempArray));
      }
    }
  }

  public getHistory() { // Sends History Data To History Component
    return JSON.parse(localStorage.getItem('history'));
  }

  public deleteHistoryItem(item: string): void {
    let tempArray: any = JSON.parse(localStorage.getItem('history'));
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] == item) tempArray.splice(i, 1);
    }
    localStorage.setItem('history', JSON.stringify(tempArray));
  }

  public saveData(data: Object): void {
    let tempArray: Object[] = [];
    if (localStorage.getItem('data') == null) {
      tempArray.push(data);
      localStorage.setItem('data', JSON.stringify(tempArray));
    } else {
      tempArray = JSON.parse(localStorage.getItem('data'));
      tempArray.unshift(data);
      localStorage.setItem('data', JSON.stringify(tempArray));
    }
    this.commsMsg.next([true, true, false, 'Dane zapisane']);
  }

  public newData(): void {
    this.enterNewData.next(true);
  }

}
