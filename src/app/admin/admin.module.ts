import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminLayoutComponent } from './components/shared/admin-layout/admin-layout.component';



@NgModule({
  declarations: [
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
