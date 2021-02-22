import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DisplayAppointments } from './../entitites/DisplayAppointment';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { AppointmentService } from './../services/appointment.service';
import { Appointment } from './../entitites/Appointment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { app } from 'firebase';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit ,OnDestroy{

  numberOfAppointments: number;
  appointments: Appointment[];
  patients: UserEmail[];
  displayAppointments: Appointment[];
  displayNextAppointments: Appointment[];
  todayDate: any;
  doctorUid: string;
  private subscription1 : Subscription;
  private subscription2 : Subscription;
  private subscription3 :Subscription;
  private subscription4 :Subscription;

  constructor(private appointmentService: AppointmentService, private userService: UserService,private router: Router) {}

  ngOnInit(): void {


    this.subscription3 = new Subscription();
    this.subscription4 = new Subscription();
    this.doctorUid=sessionStorage.getItem('uid');
    this.patients = [];
    this.appointments=[];
    this.displayAppointments=[];
    this.displayNextAppointments = [];
    this.setDate();
    this.getAppointments();
    this.getNextAppointments();

  }
  ngOnDestroy()
  {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.displayAppointments=[];
    this.displayNextAppointments = [];
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
          this.displayAppointments = appointments;
          this.numberOfAppointments= appointments.length;
        })

  }

  public getNextAppointments()
  {
    this.displayNextAppointments=[];
    this.appointments = [];
    this.patients = [];

      this.subscription2=this.appointmentService.getNextAppointmentsByDoctor(this.doctorUid).subscribe(appointments =>
         {

          this.appointments = appointments;
          this.displayNextAppointments = appointments;
        });
  }

  public videoType(type: string): boolean {

    if(type === 'video appointment')return true;
    else return false;
  }

}
