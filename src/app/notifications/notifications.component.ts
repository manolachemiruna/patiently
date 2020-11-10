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



  constructor(private dialog: MatDialog, private userService: UserService) { }

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
       v.filter(user => user.doctorId === this.doctor.id)
      )
    ).subscribe(patient => {
        this.patients = patient;
        console.log(patient);
      });
  }

  onClickSendMessage() {
    this.sendMessage = true;
  }

  send() {
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


}
