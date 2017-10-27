import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { OutputComponent } from './components/output/output.component';
import { CacheService } from './services/cache.service';
import { ApiService } from './services/api.service';
import { CommsComponent } from './components/comms/comms.component';
import { HistoryComponent } from './components/search/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    OutputComponent,
    CommsComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CacheService, ApiService, CommsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
