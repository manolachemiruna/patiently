import { Injectable } from '@angular/core';
import { Appointment } from '../entitites/Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  appointments: Array<Appointment> = new Array<Appointment>();
  constructor() { }

  getAppointments()
  {
    return this.appointments;
  }

  addAppointment(appointment: Appointment)
  {
    this.appointments.push(appointment);
  }
}
