import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-comms',
  templateUrl: './comms.component.html',
  styleUrls: ['./comms.component.css']
})
export class CommsComponent implements OnInit {

  display: boolean = false;
  displayBtn: boolean = false;
  displayBar: boolean = false;
  message: string;

  hideComms() {
    this.display = false
    this.displayBtn = false;
    this.displayBar = false;
  }

  constructor(private cacheservice: CacheService) { }

  ngOnInit() {
    this.cacheservice.commsMsg.subscribe(res => {
      this.display = res[0];
      this.displayBtn = res[1];
      this.displayBar = res[2];
      this.message = res[3];
    })
  }
}
