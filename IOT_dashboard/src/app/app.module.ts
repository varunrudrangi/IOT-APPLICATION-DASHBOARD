
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ThingsComponent } from './things/things.component';
import { ServicesComponent } from './services/services.component';
import { RelationshipsComponent } from './relationships/relationships.component';
import { ApplicationsComponent } from './applications/applications.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    ThingsComponent,
    ServicesComponent,
    RelationshipsComponent,
    ApplicationsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
