import { DoctorEmail } from './../entitites/DoctorEmail';
import { Appointment } from './../entitites/Appointment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  appointments: Observable<Appointment[]>;
  appointmentsCollection: AngularFirestoreCollection<Appointment>;
  appointmentsDoc: AngularFirestoreDocument<Appointment>;
  todayDate: any;
  doctor: DoctorEmail;
  currentMonth:number;
  currentDay:number;


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
    this.todayDate = new Date();
    this.currentMonth=this.todayDate.getMonth();
    this.currentDay=this.todayDate.getDate();
    console.log(this.currentMonth);
    const datePipe = new DatePipe("en-US");
    this.todayDate = datePipe.transform(this.todayDate, 'dd/MM/yyyy');
  }

  public getAppointments() {

     return this.appointments;
  }

  public addAppointment(appointment: Appointment) {

     this.insertUserData(appointment);
  }


  public insertUserData(appointment: Appointment) {

    return this.db.collection(`appointments`).add({
      date: appointment.date,
      hour: appointment.hour,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      type: appointment.type,
      link: appointment.link,
    });
  }

  public deleteAppointment(id:string): void {

    this.appointmentsDoc = this.db.doc(`appointments/${id}`);
    this.appointmentsDoc.delete();
  }

  public getAppointmentsByDoctor(uid: string)
  {
    return this.getAppointments().pipe(
      map(p => p.filter(appointment => appointment.doctorId === uid && appointment.date === this.todayDate ))
    );
  }

  public getAppointmentsById(id: string)
  {
    return this.getAppointments().pipe(
      map(p => p.filter(appointment => appointment.id === id ))
    );
  }

  public getNextAppointmentsByDoctor(uid: string)
  {
    return this.getAppointments().pipe(
      map(p => p.filter(appointment =>
          appointment.doctorId === uid && appointment.date !== this.todayDate && parseInt(appointment.date.substring(4)) === this.currentMonth +1
        ))
    );
  }

  public getPastAppointmentsByDoctor(uid: string)
  {
    return this.getAppointments().pipe(
      map(p => p.filter(appointment =>
          appointment.doctorId === uid && appointment.date !== this.todayDate && parseInt(appointment.date.substring(4,5)) < this.currentMonth +1
         || appointment.doctorId === uid && appointment.date !== this.todayDate && parseInt(appointment.date.substring(4,5)) === this.currentMonth+1 && parseInt(appointment.date.substring(0,2))<this.currentDay
          ))
    );
  }


}
