// src/app/services/services.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getServices().subscribe(data => {
      this.services = data;
    }, error => {
      console.error('Error fetching services', error);
    });
  }
}
