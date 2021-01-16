import { DisplayAppointments } from './../entitites/DisplayAppointment';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { DoctorEmail } from './../entitites/DoctorEmail';
import { AppointmentService } from './../services/appointment.service';
import { Appointment } from './../entitites/Appointment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  numberOfAppointments: number = 0;
  message: string;
  firstname: string;
  lastname: string;
  password: string;
  Cpassword: string;
  email: string;
  closeResult: string;
  numbers = ["Heart Rate", "EKG"];
  appointments: Appointment[];
  doctor: DoctorEmail;
  patients: UserEmail[];
  displayAppointments: DisplayAppointments[];
  displayNextAppointments: DisplayAppointments[];
  todayDate: any;
  constructor(private modalService: NgbModal, private appointmentService: AppointmentService, private userService: UserService) { }

  ngOnInit(): void {

    this.patients = new Array<UserEmail>();
    this.displayAppointments = new Array<DisplayAppointments>();
    this.displayNextAppointments = new Array<DisplayAppointments>();
    this.numberOfAppointments = 0;
    this.getDoctor();
    this.setDate();
    this.getAppointments();


  }

  markAsDone(id) {
    this.appointmentService.deleteAppointment(id);
    this.displayNextAppointments = [];
    this.displayAppointments = [];
    this.appointments = [];
    this.patients = [];
    this.numberOfAppointments = 0;
    sessionStorage.removeItem('numberOfAppointments');
  }

  setDate() {
    this.todayDate = new Date();
    console.log(this.todayDate);
    const datePipe = new DatePipe("en-US");
    this.todayDate = datePipe.transform(this.todayDate, 'dd/MM/yyyy');
    console.log(this.todayDate);
  }

  getDoctor() {
    const email = sessionStorage.getItem('user');
    this.userService.getDoctors().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(doctor => {
        this.doctor = doctor[0];
        console.log(this.doctor);
      });
  }

  getAppointments() {

    this.numberOfAppointments = 0;
    sessionStorage.removeItem('numberOfAppointments');
    this.appointmentService.getAppointments().pipe(
    map(a => a.filter(app => app.doctorId === this.doctor.id))
  ).subscribe(appointments => {

   this.appointments = appointments;
   appointments.forEach(i => {
      this.userService.getPatientById(i.patientId).subscribe(patient => {
          this.patients.push(patient[0]);
          let month = this.todayDate.split("/")[1].padStart(2, "0");
          let month2 = i.date.split("/")[1].padStart(2, "0");
          console.log(month);
          if (i.date === this.todayDate) {
          const display = {
            hour: i.hour,
            date: i.date,
            id: i.id,
            type: i.type,
            link: i.link,
            patientName : patient[0].lastname + " " + patient[0].firstname
          };
          this.displayAppointments.push(display);
          this.numberOfAppointments++;
          console.log(this.numberOfAppointments);
          sessionStorage.removeItem('numberOfAppointments');
          sessionStorage.setItem('numberOfAppointments', this.numberOfAppointments.toString());
        } else if(month===month2) {
          const display = {
            hour: i.hour,
            date: i.date,
            id: i.id,
            type: i.type,
            link: i.link,
            patientName : patient[0].lastname + " " + patient[0].firstname
          };
          this.displayNextAppointments.push(display);
        }
        });

    });
  });

  }

  videoType(type)
  {
    if(type === 'video appointment')return true;
    else return false;
  }

}
