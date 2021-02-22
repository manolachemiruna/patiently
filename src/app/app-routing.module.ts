import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AdminGuardService } from './guards/admin-guard.service';


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "patients/:id", component: PatientsComponent, canActivate: [AuthGuardService]},
  {path: "patients", component: PatientsComponent, canActivate: [AuthGuardService]},
  {path: "appointments", component: RegisterComponent, canActivate: [AuthGuardService]},
  {path: "login", component: LoginComponent},
  {path: "logout", component: LogoutComponent},
  {path: "notifications", component: NotificationsComponent, canActivate: [AuthGuardService]},
  {path: "admin", component: AdminComponent, canActivate: [AdminGuardService]},
  {path: "forgotPassword", component: ForgotPasswordComponent},
  {path: "resetPassword", component: ResetPasswordComponent},
  {path: "**", component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
