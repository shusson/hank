import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const url = "http://localhost:3000";

@Injectable()
export class DataService {

    constructor(private http: HttpClient) {
    }

    getSuburbs(): Observable<any> {
        return this.http.get(`${url}/suburbs`);
    }

    getSuburb(postcode) {
        return this.http.get(`${url}/suburbs/${postcode}`);
    }

    getSuburbServices(postcode): Observable<any> {
        return this.http.get(`${url}/suburbs/${postcode}/services`);
    }

    getServices(): Observable<any> {
        return this.http.get(`${url}/services`);
    }

    getService(postcode, service) {
        return this.http.get(`${url}/suburbs/${postcode}/services/${service}`);
    }
}
