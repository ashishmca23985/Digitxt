import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizeComponent } from './unauthorize/unauthorize.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FullSizeLayoutComponent } from './shared/full-size-layout/full-size-layout.component';
import { LayoutComponent } from './shared/layout/layout.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    UnauthorizeComponent,
    HeaderComponent,
    FooterComponent,
    FullSizeLayoutComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PublicModule { }
