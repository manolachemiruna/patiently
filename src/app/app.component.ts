import { AppointmentService } from './services/appointment.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'patiently';

  displayAppointments=[];
  appointments = [];
  patients = [];
  doctorUid: string;
  constructor(private appointmentService:AppointmentService)
  {
    this.doctorUid=sessionStorage.getItem('uid');
    console.log("aici");
    this.getPastAppointmentsByDoctor();

  }

  public delete(id: string): void {
    this.appointmentService.deleteAppointment(id);
  }

  public getPastAppointmentsByDoctor(): void {

    this.displayAppointments=[];
    this.appointments = [];
    this.patients = [];

      this.appointmentService.getPastAppointmentsByDoctor(this.doctorUid).subscribe(appointments =>
        appointments.forEach(app => this.delete(app.id)));

  }

}


