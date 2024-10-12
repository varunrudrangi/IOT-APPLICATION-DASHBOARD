// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThingsComponent } from './things/things.component';
import { ServicesComponent } from './services/services.component';
import { RelationshipsComponent } from './relationships/relationships.component';
import { ApplicationsComponent } from './applications/applications.component';

const routes: Routes = [
  { path: 'things', component: ThingsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'relationships', component: RelationshipsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '', redirectTo: '/things', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
