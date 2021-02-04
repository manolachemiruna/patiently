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
import { app } from 'firebase';
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



  constructor(private dialog: MatDialog,
              private userService: UserService,
              private messageService: MessagesService,
              private router: Router) { }

  ngOnInit(): void {


    const email = sessionStorage.getItem('user');
    this.userService.getDoctors().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(doctor => {
        this.doctor = doctor[0];
      });

    this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.doctorId ===
         this.doctor.id)
      )
    ).subscribe(patient => {
        this.patients = patient;
        console.log(this.patients);
        // tslint:disable-next-line: prefer-for-of
        this.patientsOnCurrentPage.push(this.patients[this.curentPage - 1]);

        for (let i = 0; i < this.patients.length - 1 && i < 3; i++) {
          this.patientsOnCurrentPage.push(this.patients[this.curentPage + i]);
        }

        console.log(this.patientsOnCurrentPage);

        if (this.patients.length === this.patientsOnCurrentPage.length) {
          const element = document.getElementById("previous") as HTMLInputElement;
          element.disabled = true;
          const element2 = document.getElementById("next") as HTMLInputElement;
          element2.disabled = true;
        }
      });
  }

  onClickSendMessage() {
    this.sendMessage = true;
  }

  send(id, message) {
    this.messageService.addMessage(id, message);
    this.sendMessage = false;
  }

  isSelected(id: number) {
    return id === this.selectedId;
  }

  openNewRequestDialog(appointment: Appointment, patient: UserEmail): void {
     const doctorId = this.doctor.id;
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
  console.log(index);
  const co = contor + 4;


  if (index < this.patients.length && index >= 0 && this.patientsOnCurrentPage.length === 4) {
    for (let i = 0; i <= 6; i++) {this.patientsOnCurrentPage.pop(); }
    console.log(this.patientsOnCurrentPage);
    for (let i = contor; i < co; i++) {if (this.patients[i] !== undefined) {this.patientsOnCurrentPage.push(this.patients[i]); } }
    console.log(this.patientsOnCurrentPage);
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
    console.log(this.patientsOnCurrentPage);
    this.curentPage--;
  } else {
    const element = document.getElementById("previous") as HTMLInputElement;
    element.disabled = true;
  }


}

navigate(event, id) {
  console.log(id);
  this.router.navigate(['/patients', id]);
}


getPatientByName(fullName) {


  let fullname = fullName.replace(/\s/g, '');
  fullname = fullname.toUpperCase();
  const regex = new RegExp("^" + fullname + ".*");
  console.log(fullname);

  if (fullname !== '' && fullname != null) {
  this.userService.getPatients().pipe(
    map(v =>
      v.filter(user => (user.lastname + user.firstname).toUpperCase === fullname || (user.firstname + user.lastname).toUpperCase() === fullname || user.lastname.toUpperCase() === fullname || user.firstname.toUpperCase() === fullname || regex.test(user.lastname.toUpperCase()) || regex.test(user.firstname.toUpperCase()) || regex.test((user.lastname + user.firstname).toUpperCase()) || regex.test((user.firstname + user.lastname).toUpperCase()))
     )
  ).subscribe(patient => {
      this.searchedPatient = patient;
      console.log(this.searchedPatient);
      if (this.searchedPatient.length === 0) {
        this.message = 'There is no patient with this name!';
      } else { this.message = null; }
    });
  }
}

}
