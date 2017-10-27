import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { TaxPayerInterface } from '../../models/taxpayer-interface';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  data: TaxPayerInterface = {};
  display: boolean = false;
  saveButton: boolean = false;
  edit: boolean = true;

  constructor(private cacheService: CacheService) {}

  ngOnInit() {
    this.cacheService.outputData.subscribe(res => { //  Data Flow Observable
      this.data = res;
      this.display = true;
    })
    this.cacheService.enterNewData.subscribe(res => {
      this.edit = false;
      this.display = true;
      this.data = {};
      this.saveButton = true;
    })
  }

  private saveData(): void {
    this.cacheService.saveData(this.data);
  }

  private closeComponent(): void {
    this.display = false;
    this.saveButton = false;
    this.edit = true;
  }

}
