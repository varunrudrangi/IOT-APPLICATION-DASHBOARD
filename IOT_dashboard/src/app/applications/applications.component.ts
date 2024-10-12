// src/app/applications/applications.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: any = [];
  services: any = [];
  relationships: any = [];
  thresholdvalue: any = 0
  comparisionOperator: string = '<'
  newApp = {
    name: '',
    service1: '',
    service2: '',
    relationship: ''
  };
  enableOtherProps: boolean = false

  constructor(private apiService: ApiService) {  this.enableOtherProps = false; }

  ngOnInit(): void {
    this.getAppLists();
    this.apiService.getServices().subscribe(data => {
      this.services = data;
    })
    this.apiService.getRelationships().subscribe(data => {
      this.relationships = data;
    })
  }
  getAppLists(){
    this.apiService.getAppList().subscribe(data => {
      this.applications = data;
    }, error => {
      console.error('Error fetching applications', error);
    });
  }

  activateApp(appName: string): void {
    this.apiService.activateApp(appName).subscribe(() => {
      this.getAppLists();
    }, error => {
      console.error('Failed to activate app', error);
    });
  }

  stopApp(appName: string): void {
    this.apiService.stopApp(appName).subscribe(() => {
      this.getAppLists();
    }, error => {
      console.error('Failed to stop app', error);
    });
  }

  deleteApp(appName: string): void {
    this.apiService.deleteApp(appName).subscribe(() => {
      this.getAppLists();
    }, error => {
      console.error('Failed to delete app', error);
    });
  }
  saveApp(appName: string): void {
    this.apiService.saveApp(appName).subscribe(() => {
      this.getAppLists();
    }, error => {
      console.error('Failed to save app', error);
    });
  }

  addApplication(): void {
    const newAppData: any = {
      appName: this.newApp.name,
      service1: this.services.find((each: any) => each.name === this.newApp.service1),
      service2: this.services.find((each: any) => each.name === this.newApp.service2),
    }
    if(this.newApp.relationship == 'Condition-based relationship'){
      newAppData.relationship = {
        name: this.newApp.relationship,
        comparision: this.comparisionOperator == '<' ? 'lt' : 'gt',
        threshold: this.thresholdvalue
      }
    } else{
      newAppData.relationship = {
        name: this.newApp.relationship
      }
    }
    this.apiService.createNewApp(newAppData).subscribe(() => {
      this.getAppLists();
    })

    // Here you might want to call an API to add the new application
  }
  onSelectChange(){
    if(this.newApp.relationship == 'Condition-based relationship'){
      this.enableOtherProps = true
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.apiService.uploadAppConfig(formData).subscribe({
        next: (response) => {
          this.getAppLists();
        },
        error: (error) => {
          console.error('Error uploading file', error);
          alert('Error uploading file');
        }
      });
    }
  }

}
