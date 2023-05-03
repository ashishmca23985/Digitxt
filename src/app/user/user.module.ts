import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedComponent } from './shared/shared.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UserLayoutComponent } from './shared/user-layout/user-layout.component';



@NgModule({
  declarations: [
    DashboardComponent,
    SharedComponent,
    HeaderComponent,
    FooterComponent,
    UserLayoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
