import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DisplayAppointments } from './../entitites/DisplayAppointment';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { AppointmentService } from './../services/appointment.service';
import { Appointment } from './../entitites/Appointment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit ,OnDestroy{

  numberOfAppointments: number;
  appointments: Appointment[];
  patients: UserEmail[];
  displayAppointments: DisplayAppointments[];
  displayNextAppointments: DisplayAppointments[];
  todayDate: any;
  doctorUid: string;
  private subscription1 : Subscription;
  private subscription2 : Subscription;
  private subscription3 :Subscription;
  private subscription4 :Subscription;

  constructor(private appointmentService: AppointmentService, private userService: UserService,private router: Router) {}

  ngOnInit(): void {


    this.doctorUid=sessionStorage.getItem('uid');
    this.patients = [];
    this.appointments=[];
    this.displayAppointments=[];
    this.displayNextAppointments = [];
    console.log(this.displayAppointments);
    this.setDate();
    this.getAppointments();
    console.log(this.displayAppointments);
    this.getNextAppointments();

  }
  ngOnDestroy()
  {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }

  public markAsDone(id: string): void {

    this.appointmentService.deleteAppointment(id);
    this.displayNextAppointments = [];
    this.displayAppointments = [];
    this.appointments = [];
    this.patients = [];
    sessionStorage.removeItem('numberOfAppointments');
  }

  public setDate(): void {

    this.todayDate = new Date();
    const datePipe = new DatePipe("en-US");
    this.todayDate = datePipe.transform(this.todayDate, 'dd/MM/yyyy');
  }

  public getAppointments(): void {

    this.displayAppointments=[];
    this.appointments = [];
    this.patients = [];

      this.subscription1=this.appointmentService.getAppointmentsByDoctor(this.doctorUid).subscribe(appointments =>
         {

          this.appointments = appointments;
          console.log(this.appointments);
          this.numberOfAppointments= appointments.length;

          this.appointments.forEach(i => {
          this.subscription3=this.userService.getPatientById(i.patientId).subscribe(patient => {
            this.patients.push(patient[0]);

            const display = {
              hour: i.hour,
              date: i.date,
              id: i.id,
              type: i.type,
              link: i.link,
              patientName : patient[0].lastname + " " + patient[0].firstname,
            };
            this.displayAppointments.push(display);
        })});
      })

  }

  public getNextAppointments()
  {
    this.displayNextAppointments=[];
    this.appointments = [];
    this.patients = [];

      this.subscription2=this.appointmentService.getAppointments().subscribe(appointments =>
         {

          this.appointments = appointments;

          appointments.forEach(i => {
          this.subscription4=this.userService.getPatientById(i.patientId).subscribe(patient => {
            this.patients.push(patient[0]);
            let month = this.todayDate.split("/")[1].padStart(2, "0");
            let month2 = i.date.split("/")[1].padStart(2, "0");

            const display = {
              hour: i.hour,
              date: i.date,
              id: i.id,
              type: i.type,
              link: i.link,
              patientName : patient[0].lastname + " " + patient[0].firstname,
            };
            if(month===month2 && this.todayDate !== i.date)this.displayNextAppointments.push(display);
        })});
      })
  }

  public videoType(type: string): boolean {

    if(type === 'video appointment')return true;
    else return false;
  }

}
