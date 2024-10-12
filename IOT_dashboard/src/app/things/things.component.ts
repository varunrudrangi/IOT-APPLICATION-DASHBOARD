// src/app/things/things.component.ts
// src/app/things/things.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-things',
  templateUrl: './things.component.html',
  styleUrls: ['./things.component.css']
})
export class ThingsComponent implements OnInit {
  things: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getThings().subscribe(data => {
      this.things = data;
    }, error => {
      console.error('Error fetching things', error);
    });
  }
}
