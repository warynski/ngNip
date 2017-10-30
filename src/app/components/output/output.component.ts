import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { TaxPayerInterface } from '../../models/taxpayer-interface';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  data: TaxPayerInterface = {};       // Container For Data
  display: boolean = false;           // Sets diaplay Of Component
  saveButton: boolean = false;        // Sets Diaplay Of 'Save Data' Button
  edit: boolean = true;               // Sets If Component Is Set to Display Or Enter Data

  constructor(private cacheService: CacheService) { }

  ngOnInit() {
    this.cacheService.outputData.subscribe(res => {   //  Data Flow Observable
      this.data = res;
      this.display = true;
    })
    this.cacheService.enterNewData.subscribe(res => {   // Allows The User To Enter Data 
      this.edit = false;
      this.display = true;
      this.data = {};
      this.saveButton = true;
    })
  }

  private saveData(): void {    // Saves User Data
    this.cacheService.saveData(this.data);
  }

  private closeComponent(): void {    // Shuts Down Component 
    this.display = false;
    this.saveButton = false;
    this.edit = true;
  }

}
