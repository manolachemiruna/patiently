import { Message } from './entitites/Message';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NotificationsComponent } from './notifications/notifications.component';
import { RequestDialogComponent } from './request-dialog/request-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { AdminComponent } from './admin/admin.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {TabViewModule} from 'primeng/tabview';
import { PatientComponent } from './admin/components/patient/patient.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DoctorsComponent } from './admin/components/doctors/doctors.component';
import { TodayComponent } from './register/today/today/today.component';
import { ThisMonthComponent } from './register/thisMonth/this-month/this-month.component';
import {InputSwitchModule} from 'primeng/inputswitch';
import { NgApexchartsModule } from "ng-apexcharts";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import { JoinMeetingComponent } from './join-meeting/join-meeting.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, LegendService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { DataLabelService, LineSeriesService,ZoomService,SelectionService} from '@syncfusion/ej2-angular-charts';
import { GridModule } from '@syncfusion/ej2-angular-grids';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    PatientsComponent,
    NotificationsComponent,
    RequestDialogComponent,
    AdminComponent,
    DoctorsComponent,
    PatientComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ErrorMessageComponent,
    TodayComponent,
    ThisMonthComponent,
    JoinMeetingComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    TabViewModule,
    MatTabsModule,
    MatTableModule,
    HttpClientModule,
    ToastModule,
    InputSwitchModule,
    NgApexchartsModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    DropdownModule,
    ConfirmDialogModule,
    ChartModule,
    GridModule
   ],
  providers: [MatDatepickerModule, HttpClient,MessageService,CategoryService, LegendService,
     TooltipService, DataLabelService, LineSeriesService,ZoomService,SelectionService ],
  bootstrap: [AppComponent],
  entryComponents: [
    RequestDialogComponent
],
})
export class AppModule { }
