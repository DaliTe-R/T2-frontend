import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// http://locallhost:9090/patients
// http://localhost:9090/medics

export class Patient {

  constructor (private http: HttpClient){}

  private url: string = `${environment.HOST}/patients`;


  findAll(){
      return this.http.get(this.url);
  }
}
