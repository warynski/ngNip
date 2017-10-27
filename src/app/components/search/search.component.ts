import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  weightRegon9: Array<number> = [8,9,2,3,4,5,6,7];
  weightRegon14: Array<number> = [2,4,8,5,0,9,8,3,6,1,2,4,8];
  weightNip: Array<number> = [6,5,7,2,3,4,5,6,7];
  validationActive: boolean = true;
  historyDOM: any = false;
  

  constructor(private cacheService: CacheService) {}
  
  ngOnInit() {
    this.cacheService.historySwitch.subscribe( (res) => { // History Display Observable Watcher
      this.historyDOM = res;
    })
    this.tempData();
  }

  private setValidation(): void { // Toggles User Entry Data Validation
    this.validationActive = !this.validationActive; 
  }

  onSubmit(string: string) {  // Initializes Data Flow And Sets Validtion Of Entered Number
    if ( this.validationActive ) {
      this.stringValidation(string);
    } else {
      this.cacheService.getData(string, undefined);
    }
  }

  stringValidation(string: string): void {  // Preliminary Number Verification
    let value: string = string.replace(/\D/g, '');
    if ( value.length == 9 || value.length == 14) {
      this.isRegon(value);
    } else if ( value.length == 10 ) {
      this.isNip(value);
    } else {
      this.cacheService.notValid();
    }
  }

  isRegon(string: string): void { // Regon Checksum Validation

    let total: number = 0;
    let array: Array<number> = string.split('').map(Number);
    let arrayLength: number = (array.length)-1;

    if ( arrayLength == 8 ) { // 9 digits Regon Validation
      for ( let i=0; i <= array.length-2; i++ ) {
        array[i] = array[i] * this.weightRegon9[i];
        total += array[i];
      }
      if ( array[arrayLength] == total%11 ) {
        this.cacheService.getData(string,'REGON');
      } else {
        this.cacheService.notValid();
      }
    } else {  // 14 digits Regon Validation
      for ( let i=0; i <= array.length-2; i++ ) {
        array[i] = array[i] * this.weightRegon14[i];
        total += array[i];
      }
      if ( array[arrayLength] == total%11 ) {
        this.cacheService.getData(string,'REGON');
      } else {
        this.cacheService.notValid();
      }
    }
  }

  isNip(string: string): void { // Nip Checksum Validation
    let total: number = 0;
    let array: Array<number> = string.split('').map(Number);
    let arrayLength: number = (array.length)-1;

      for ( let i=0; i <= array.length-2; i++ ) {
        array[i] = array[i] * this.weightNip[i];
        total += array[i];
      }
      if ( array[arrayLength] == total%11 ) {
        this.cacheService.getData(string,'NIP');
      } else {
        this.isKrs(string);
      } 
  }

  isKrs(string: string): void { // Krs Validation
    let total: number = 0;
    let array: Array<number> = string.split('').map(Number);
    let arrayLength: number = (array.length)-7;
    for ( let i=0; i<=arrayLength; i++ ) {
      total += array[i];
    }
    if ( total == 0 ) {
      this.cacheService.getData(string,'KRS');
    } else {
      this.cacheService.notValid();
    }    
  }

  private showHistory(): void { // Initilizes History Component
    this.historyDOM = true;
  }

  private enterData(): void { // Launches Form To Enter New Data
    this.cacheService.newData();
  }


  private tempData(): void {  // Sets Mock Data To Cache
    let mock = [{
      Regon:"010809811",
      Nip:"5261009190",
      Krs:"0000005239",
      Name:"SHELL POLSKA SP Z O O",
      Province: "mazowieckie",
      County:"WARSZAWSKI",
      Community:"	WARSZAWA-OCHOTA",
      Place:"Warszawa",
      PostalCode:"02-366",
      Street:"Bitwy Warszawskiej 1920 R.",
      HouseNumber:"7A",
      ApartmentNumber:"",
      BusinessActivityStart:"",
      Type:"SP Z O O"},
      {
      Regon:"610188201",
      Nip:"7740001454",
      Krs:"0000028860",
      Name:"POLSKI KONCERN NAFTOWY ORLEN S A ",
      Province: "mazowieckie",
      County:"M. PŁOCK",
      Community:"M. PŁOCK",
      Place:"Płock",
      PostalCode:"09-411",
      Street:"Chemików",
      HouseNumber:"7",
      ApartmentNumber:"",
      BusinessActivityStart:"",
      Type:"S.A."},
      {
      Regon:"121117429",
      Nip:"9720865431",
      Krs:"0000345546",
      Name:"BP EUROPA SE SPÓŁKA EUROPEJSKA ODDZIAŁ W POLSCE ",
      Province: "małopolskie",
      County:"M. Kraków",
      Community:"Kraków-Krowodrza",
      Place:"Kraków",
      PostalCode:"31-358",
      Street:"Jasnogórska",
      HouseNumber:"1",
      ApartmentNumber:"",
      BusinessActivityStart:"",
      Type:"ODDZIAŁ ZAGRANICZNEGO PRZEDSIĘBIORCY"}];
      if ( localStorage.getItem('data') === null ) {
        let t = JSON.stringify(mock);
        localStorage.setItem('data', t);
      } else {
        let t = JSON.parse(localStorage.getItem('data'));
        let res = t.find((elem) => elem.Regon == "121117429");
        if ( res == undefined ) {
          let t2 = mock.concat(t);
          localStorage.setItem('data', JSON.stringify(t2));
        }        
      }
  }
}
