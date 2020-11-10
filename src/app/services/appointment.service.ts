import { Appointment } from './../entitites/Appointment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  appointments: Observable<Appointment[]>;
  appointmentsCollection: AngularFirestoreCollection<Appointment>;
  appointmentsDoc: AngularFirestoreDocument<Appointment>;


  constructor(private db: AngularFirestore) { }

  getAppointments()
  {

  }

  addAppointment(appointment: Appointment)
  {
     this.insertUserData(appointment);
  }


  insertUserData(appointment: Appointment) {
    return this.db.collection(`appointments`).add({
      date: appointment.date,
      hour: appointment.hour,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId
    });
  }
}
