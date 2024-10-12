// src/app/relationships/relationships.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-relationships',
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.css']
})
export class RelationshipsComponent implements OnInit {
  relationships: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getRelationships().subscribe(data => {
      this.relationships = data;
    }, error => {
      console.error('Error fetching relationships', error);
    });
  }
}
