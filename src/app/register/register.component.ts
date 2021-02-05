import { DisplayAppointments } from './../entitites/DisplayAppointment';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { AppointmentService } from './../services/appointment.service';
import { Appointment } from './../entitites/Appointment';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  numberOfAppointments: number;
  appointments: Appointment[];
  patients: UserEmail[];
  displayAppointments: DisplayAppointments[];
  displayNextAppointments: DisplayAppointments[];
  todayDate: any;
  doctorUid: string;

  constructor(private appointmentService: AppointmentService, private userService: UserService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.doctorUid=sessionStorage.getItem('uid');
    this.patients = [];
    this.appointments=[];
    this.displayAppointments=[];
    this.displayNextAppointments = [];
    this.setDate();
    this.getAppointments();
    this.getNextAppointments();

  }

  ionViewWillEnter(){
    this.ngOnInit();
  }


  public markAsDone(id: string): void {

    this.appointmentService.deleteAppointment(id);
    this.displayNextAppointments = [];
    this.displayAppointments = [];
    this.appointments = [];
    this.patients = [];
    sessionStorage.removeItem('numberOfAppointments');
  }

  confirm(id:string): void {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete it?',

        accept: () => {
          this.appointmentService.deleteAppointment(id);
          this.displayNextAppointments = [];
          this.displayAppointments = [];
          this.appointments = [];
          this.patients = [];
          sessionStorage.removeItem('numberOfAppointments');
        }
    });
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
      this.appointmentService.getAppointmentsByDoctor(this.doctorUid).subscribe(appointments =>
         {

          this.appointments = appointments;
          this.numberOfAppointments= appointments.length;

          appointments.forEach(i => {
          this.userService.getPatientById(i.patientId).subscribe(patient => {
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
      this.appointmentService.getAppointments().subscribe(appointments =>
         {

          this.appointments = appointments;

          appointments.forEach(i => {
          this.userService.getPatientById(i.patientId).subscribe(patient => {
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
