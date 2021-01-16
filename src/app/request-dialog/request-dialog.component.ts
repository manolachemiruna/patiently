import { AppointmentService } from './../services/appointment.service';
import { Appointment } from './../entitites/Appointment';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent implements OnInit {

  errorMessage: string;
  date: any; // momentan
  hour: string; // momentan
  patientId: string;
  doctorId: string;
  appointments: any;
  message: string;
  type: string;
  link: string;
  todayDate:Date = new Date();
  types = ['video appointment', 'physical appointment'];
  hourList = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  constructor(
              private appointmentService: AppointmentService,
              public dialogRef: MatDialogRef<RequestDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.message = null;
    this.patientId = this.data.patientId;
    this.doctorId = this.data.doctorId;
    this.type=null;
    this.link=null;

  }

  send(): void {

    const datePipe = new DatePipe("en-US");
    this.date = datePipe.transform(this.date, 'dd/MM/yyyy');
    const appointment = new Appointment();
    appointment.date = this.date;
    appointment.hour = this.hour;
    appointment.patientId = this.patientId;
    appointment.doctorId = this.doctorId;
    appointment.link = this.link;
    appointment.type = this.type;
    this.appointmentService.addAppointment(appointment);
    this.dialogRef.close();
    this.type=null;
    this.link=null;

}

enableBtn() {

  const element = document.getElementById("button") as HTMLInputElement;
  element.disabled = false;
}


 verifyInput(value) {

  const element = document.getElementById("button") as HTMLInputElement;
  if (value != null) { element.disabled = false; } else { element.disabled = true; }
  return true;
 }

 videoType()
 {
   if(this.type === 'video appointment')return true;
   else return false;
 }
}
