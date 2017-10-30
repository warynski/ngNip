import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../../services/cache.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  items: any;
  alert: boolean = false;
  period: number = 24;

  constructor(private cacheService: CacheService) { }

  ngOnInit() {
    this.getHistory();
  }

  private deactivate(): void {
    this.cacheService.historySwitch.next(false); // shuts down HistoryComponent
  }

  private clearHistoryAlert(value: boolean): void {
    this.alert = value;
  }

  private getHistory(): void{
    this.items = this.cacheService.getHistory();
    console.log(this.items);
  }

  private clearHistory(): void {
    this.alert = false;
    localStorage.clear();
    this.getHistory();
  }

  private getItem(item: string): void{
    this.cacheService.getDataFromCache(item);
    this.deactivate();
  }

  private deleteItem(item: string): void {
    this.cacheService.deleteHistoryItem(item);
    this.getHistory()
  }

  private storagePeriod(period: number): void {
    this.period = period;
    this.cacheService.dataVsDate(period);
  }
}
