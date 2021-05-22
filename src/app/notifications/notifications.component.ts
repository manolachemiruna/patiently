import { AppointmentService } from './../services/appointment.service';
import { Router } from '@angular/router';
import { MessagesService } from './../services/messages.service';
import { UserEmail } from './../entitites/UserEmail';
import { Appointment } from './../entitites/Appointment';
import { DoctorEmail } from './../entitites/DoctorEmail';
import { UserService } from './../services/user.service';
import { RequestDialogComponent } from './../request-dialog/request-dialog.component';
import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit,OnDestroy {

  patients: any;
  sendMessage: boolean = false;
  message: string;
  selectedId: number = 1;
  appointment: Appointment;
  doctor: DoctorEmail;
  patientsOnCurrentPage:Array<UserEmail>;
  curentPage = 1;
  currentIndex = 0;
  search: string;
  searchedPatient: any;
  numberOfAppointments: number;
  uid: string;
  onAppointment:string;
  noPatient:boolean;
  subscription1 : Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;



  constructor(private dialog: MatDialog,
              private userService: UserService,
              private messageService: MessagesService,
              private appointmentService: AppointmentService,
              private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;};
      this.patients = [];
      this.patientsOnCurrentPage = [];
               }

  ngOnInit(): void {

    this.patients = [];
    this.patientsOnCurrentPage = new Array<UserEmail>();
    this.subscription3 = new Subscription();
    this.patients = [];
    this.patientsOnCurrentPage = [];
    this.onAppointment='false';
    sessionStorage.setItem('closed','false');
    this.uid = sessionStorage.getItem('uid');

    this.subscription1=this.appointmentService.getAppointmentsByDoctor(this.uid).subscribe(appointments =>this.numberOfAppointments = appointments.length);

    this.subscription2=this.userService.getPatientByDoctorId(this.uid).subscribe(patient => {
        this.patients = patient;
        this.patientsOnCurrentPage = [];
        // tslint:disable-next-line: prefer-for-of
        if(this.patients !== [])this.patientsOnCurrentPage.push(this.patients[this.curentPage - 1]);

        for (let i = 0; i < this.patients.length - 1 && i < 3; i++) {
          this.patientsOnCurrentPage.push(this.patients[this.curentPage + i]);
        }

        if (this.patients.length === this.patientsOnCurrentPage.length) {
          const element = document.getElementById("previous") as HTMLInputElement;
          if(element !== null)element.disabled = true;
          const element2 = document.getElementById("next") as HTMLInputElement;
          if(element2 !== null) element2.disabled = true;
        }
      });
  }

  ngOnDestroy()
  {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription3.unsubscribe();
    this.patients = [];
    this.patientsOnCurrentPage = [];
  }

  public isSelected(id: number): boolean {
    return id === this.selectedId;
  }

  openNewRequestDialog(appointment, patient): void {

     this.onAppointment='true';
     sessionStorage.setItem('closed','true');
     const doctorId = this.uid;
     const patientId = patient.id;
     const patientName = patient.lastname + ' ' + patient.firstname;
     this.dialog.open(RequestDialogComponent, {
        data: {
            appointment,
            doctorId,
            patientId,
            patientName,
        }
    });
    this.onAppointment=sessionStorage.getItem('closed');
}

  nextPage() {


    let contor;

    const patient = this.patientsOnCurrentPage[0];
    const index = this.patients.indexOf(patient); // iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor = index + this.patientsOnCurrentPage.length;
    const co = contor + 4;


    if (index < this.patients.length && index >= 0 && this.patientsOnCurrentPage.length === 4) {
      for (let i = 0; i <= 6; i++) {this.patientsOnCurrentPage.pop(); }
      for (let i = contor; i < co; i++) {if (this.patients[i] !== undefined) {this.patientsOnCurrentPage.push(this.patients[i]); } }
      this.curentPage++;
    } else {
      const element = document.getElementById("next") as HTMLInputElement;
      element.disabled = true;
    }

  }


  previousPage() {

    let contor;

    const patient = this.patientsOnCurrentPage[0];
    const index = this.patients.indexOf(patient); // iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor = index - this.patientsOnCurrentPage.length;
    const co = index - 4;


    if (index > 0) {
      for (let i = 0; i <= 6; i++) {this.patientsOnCurrentPage.pop(); }
      for (let i = co; i < index; i++) {this.patientsOnCurrentPage.push(this.patients[i]); }
      this.curentPage--;
    } else {
      const element = document.getElementById("previous") as HTMLInputElement;
      element.disabled = true;
    }

  }

  navigate(event, id) {

    this.onAppointment=sessionStorage.getItem('closed');
    if(this.onAppointment == 'false'){
    this.ngOnDestroy();
    this.router.navigate(['/patients', id]);
    }
  }




  public getPatientByName(fullName:string): void {


    let fullname = fullName.replace(/\s/g, '');
    fullname = fullname.toUpperCase();
    const regex = new RegExp("^" + fullname + ".*");

    if (fullname !== '' && fullname != null) {
    this.subscription3=this.userService.getPatientByDoctorId(this.uid).pipe(
      map(v =>
        v.filter(user => (user.lastname + user.firstname).toUpperCase() === fullname || (user.firstname + user.lastname).toUpperCase() === fullname || user.lastname.toUpperCase() === fullname || user.firstname.toUpperCase() === fullname || regex.test(user.lastname.toUpperCase()) || regex.test(user.firstname.toUpperCase()) || regex.test((user.lastname + user.firstname).toUpperCase()) || regex.test((user.firstname + user.lastname).toUpperCase()))
      )
    ).subscribe(patient => {
        this.searchedPatient = patient;
        if (this.searchedPatient.length === 0) {
          this.message = 'There is no patient with this name!';
        } else { this.message = null; }
      });
    }
  }

}
