import { DoctorEmail } from './../entitites/DoctorEmail';
import { Appointment } from './../entitites/Appointment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {map, filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  appointments: Observable<Appointment[]>;
  appointmentsCollection: AngularFirestoreCollection<Appointment>;
  appointmentsDoc: AngularFirestoreDocument<Appointment>;
  todayDate: any;
  doctor: DoctorEmail;


  constructor(private db: AngularFirestore) {
    this.appointmentsCollection = this.db.collection<Appointment>('appointments', ref => ref.orderBy('date').orderBy('hour'));
    this.appointments = this.appointmentsCollection.snapshotChanges().pipe(
      map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Appointment;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    })
    );
   }

  getAppointments() {
     return this.appointments;
  }

  addAppointment(appointment: Appointment) {
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

  deleteAppointment(id) {
    this.appointmentsDoc = this.db.doc(`appointments/${id}`);
    this.appointmentsDoc.delete();
  }

}
