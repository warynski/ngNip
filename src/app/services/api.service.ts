import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  constructor(public _http: Http) { }

  // Fetches Data From Api

  getData(string: string) {
    return this._http.get('http://ihaveanidea.aveneo.pl/NIPAPI/api/Company?CompanyId=' + string).map(res => res.json());
  }
}