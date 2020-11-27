import { DoctorEmail } from './../entitites/DoctorEmail';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { UserEmail } from '../entitites/UserEmail';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  patientsCollection: AngularFirestoreCollection<UserEmail>;
  doctorsCollection: AngularFirestoreCollection<DoctorEmail>;
  doctors: Observable<DoctorEmail[]>;
  patients: Observable<UserEmail[]>;
  userDoc: AngularFirestoreDocument<UserEmail>;
  doctorDoc: AngularFirestoreDocument<DoctorEmail>;

  constructor(private db: AngularFirestore, private http: HttpClient) {

    this.doctorsCollection = this.db.collection<DoctorEmail>('doctors');
    this.doctors = this.doctorsCollection.snapshotChanges().pipe(
      map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as DoctorEmail;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    })
    );

    this.patientsCollection = this.db.collection<UserEmail>('patients');
    this.patients = this.patientsCollection.snapshotChanges()
    .pipe(
      map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as UserEmail;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    })
    );
   }

   public getDoctors(): Observable<DoctorEmail[]> {
     return this.doctors;
   }


   public getPatients(): Observable<UserEmail[]> {
     return this.patients;
   }

   deleteDoctor(doctor) {
    this.doctorDoc = this.db.doc(`doctors/${doctor.id}`);
    this.doctorDoc.delete();
  }

  deletePatient(patient) {
    this.userDoc = this.db.doc(`patients/${patient.id}`);
    this.userDoc.delete();
  }

  getDoctorFromRegistry(firstname, lastname)
  {
    return this.http.get("https://regmed.cmr.ro/api/v1/public/cautare/" + firstname + lastname);
  }


}
