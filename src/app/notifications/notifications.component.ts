import { AppointmentService } from './../services/appointment.service';
import { Router } from '@angular/router';
import { MessagesService } from './../services/messages.service';
import { UserEmail } from './../entitites/UserEmail';
import { Appointment } from './../entitites/Appointment';
import { DoctorEmail } from './../entitites/DoctorEmail';
import { UserService } from './../services/user.service';
import { RequestDialogComponent } from './../request-dialog/request-dialog.component';
import { Component, OnInit, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  patients: any;
  sendMessage: boolean = false;
  message: string;
  selectedId: number = 1;
  appointment: Appointment;
  doctor: DoctorEmail;
  patientsOnCurrentPage = new Array<UserEmail>();
  curentPage = 1;
  currentIndex = 0;
  search: string;
  searchedPatient: any;
  numberOfAppointments: number;
  uid: string;
  onMessage:boolean;
  onAppointment:boolean;



  constructor(private dialog: MatDialog,
              private userService: UserService,
              private messageService: MessagesService,
              private appointmentService: AppointmentService,
              private router: Router) { }

  ngOnInit(): void {

    this.onAppointment=false;
    this.onMessage=false;
    this.uid = sessionStorage.getItem('uid');

    this.appointmentService.getAppointmentsByDoctor(this.uid).subscribe(appointments =>this.numberOfAppointments = appointments.length);
    this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.doctorId === this.uid)
      )
    ).subscribe(patient => {
        this.patients = patient;
        // tslint:disable-next-line: prefer-for-of
        this.patientsOnCurrentPage.push(this.patients[this.curentPage - 1]);

        for (let i = 0; i < this.patients.length - 1 && i < 3; i++) {
          this.patientsOnCurrentPage.push(this.patients[this.curentPage + i]);
        }

        if (this.patients.length === this.patientsOnCurrentPage.length) {
          const element = document.getElementById("previous") as HTMLInputElement;
          element.disabled = true;
          const element2 = document.getElementById("next") as HTMLInputElement;
          element2.disabled = true;
        }
      });
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  public onClickSendMessage(): void {
    this.onMessage=true;
    this.sendMessage = true;
  }

  public send(id:string, message:string) {
    this.messageService.addMessage(id, message);
    this.sendMessage = false;
  }

  public isSelected(id: number): boolean {
    return id === this.selectedId;
  }

  openNewRequestDialog(appointment, patient): void {
     this.onAppointment=true;
     const doctorId = this.uid;
     const patientId = patient.id;
     this.dialog.open(RequestDialogComponent, {
        data: {
            appointment,
            doctorId,
            patientId
        }
    });
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

    this.router.navigate(['/patients', id]);
  }

  cancel()
  {
    this.onMessage =false;
    this.sendMessage=false;
  }


  public getPatientByName(fullName:string): void {


    let fullname = fullName.replace(/\s/g, '');
    fullname = fullname.toUpperCase();
    const regex = new RegExp("^" + fullname + ".*");

    if (fullname !== '' && fullname != null) {
    this.userService.getPatients().pipe(
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
