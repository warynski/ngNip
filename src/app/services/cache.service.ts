import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TaxPayerInterface } from '../models/taxpayer-interface';

@Injectable()
export class CacheService {

  constructor(private apiService: ApiService) { }

  commsMsg = new Subject();       // Object Forwarded To COMMS, Communication With User
  outputData = new Subject();     // Object Forwarded To OUTPUT, Data From Service
  historySwitch = new Subject();  // Boolean Forwarded From HISTORY To SEARCH, History Display Switch
  enterNewData = new Subject();   // Sets OutputComponent For New Data
  currentTaxNumberType: string;

  public getData(string: string, numberType?: string) {
    this.currentTaxNumberType = numberType;
    if (numberType === undefined) {
      this.commsMsg.next([true, false, true, 'Walidacja wyłączona. Pobieram dane.']);
    } else {
      this.commsMsg.next([true, false, true, 'Rozpoznano prawidłowy ' + numberType + '. Pobieram dane.'])
    }
    setTimeout(() => {                                              // setTimeout is only for demonstration purpose
      if ( this.localStorageEmpty() ) {
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
      data = this.convertDate(data);
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
    if ( this.localStorageEmpty() ) {
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

  public deleteHistoryItem(item: string): void {  // Erase Record From History List
    let tempArray: any = JSON.parse(localStorage.getItem('history'));
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] == item) tempArray.splice(i, 1);
    }
    localStorage.setItem('history', JSON.stringify(tempArray));
  }

  public saveData(data: Object): void { // Saves Data Entered By User To Local Storage
    let tempArray: Object[] = [];
    if ( this.localStorageEmpty() ) {
      tempArray.push(data);
      localStorage.setItem('data', JSON.stringify(tempArray));
    } else {
      tempArray = JSON.parse(localStorage.getItem('data'));
      tempArray.unshift(data);
      localStorage.setItem('data', JSON.stringify(tempArray));
    }
    this.commsMsg.next([true, true, false, 'Dane zapisane']);
  }

  public newData(): void {  // Launches Output Component So User Can Enter New Data
    this.enterNewData.next(true);
  }

  private convertDate(data: TaxPayerInterface) {    // Changes Date Format
    let serverDate = data.BusinessActivityStart;
    let year = parseInt(serverDate.substr(0,4));
    let month = (parseInt(serverDate.substr(5,2))) - 1;
    let day = parseInt(serverDate.substr(8,2));
    let hour = parseInt(serverDate.substr(11,2));
    let minutes = parseInt(serverDate.substr(14,2));
    let clientDate = new Date(year, month, day, hour, minutes);
    data.BusinessActivityStart = clientDate;
    return data;
  }

  private outdated(): void {    // Checks If Data Is Outdated And Deletes It
    let currentDate = new Date();
    let tempData: any = JSON.parse(localStorage.getItem('data'));
    for ( let i = 0; i < tempData.length; i++ ) {
      console.log(currentDate.getTime());
      console.log(Date.parse(tempData[i].BusinessActivityStart))
      if ( currentDate.getTime() <= (Date.parse(tempData[i].BusinessActivityStart)) ) {
        tempData.splice(i,1);
      }
    }
    localStorage.setItem('data', JSON.stringify(tempData));
  }

  private localStorageEmpty():boolean{
    if (localStorage.getItem('data')==null)return true 
  }

  timer = setInterval(    // Counts Remaining Time To Check If Local Storage Data Is Outdated
    () => {
      this.outdated();
    },
    3600000*24
  )

  public dataVsDate(period: number): void {   // Launches When User Changes Data Storage Peroid
    clearInterval(this.timer);
    this.timer = setInterval(
      () => {
        this.outdated();
      },
      3600000*period
    )
  }

}
