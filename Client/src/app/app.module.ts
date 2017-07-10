import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EmpRecordsComponent } from './components/emp-records/emprecords.component';
import { FooterComponent } from './components/footer/footer.component';

import { EmpRecordsService } from '../core/emprecords.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EmpRecordsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    EmpRecordsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
