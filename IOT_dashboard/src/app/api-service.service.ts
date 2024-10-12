// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://192.168.1.67:3000/api';

  constructor(private http: HttpClient) { }

  getThings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/things`);
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services`);
  }

  getRelationships(): Observable<any> {
    return this.http.get(`${this.baseUrl}/relationships`);
  }

  getAppList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/apps/list`);
  }

  createNewApp(newAppData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apps/newApp`, newAppData)
  }

  saveApp(appName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apps/save/${appName}`, {});
  }

  // Add method in src/app/api.service.ts
  uploadAppConfig(fileData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/apps/upload`, fileData);
  }

  activateApp(appName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apps/activate/${appName}`, {});
  }

  stopApp(appName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apps/stop/${appName}`, {});
  }

  deleteApp(appName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/apps/delete/${appName}`);
  }
}
