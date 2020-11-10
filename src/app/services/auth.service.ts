import { Doctor } from './../entitites/Doctor';
import {Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../entitites/User';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: User;
  user: User;
  newDoctor: Doctor;
  doctor: Doctor;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) {}



  getUserState() {

    return this.afAuth.authState;
  }

  login( email: string, password: string) {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          sessionStorage.setItem('user', email);
          if (this.isAdmin()) { this.router.navigate(['/admin']); } else { this.router.navigate(['/notifications']); }
        }
      });


  }
  createPatient(user) {

    console.log(user);

    this.afAuth.createUserWithEmailAndPassword( user.email, user.password)
      .then( userCredential => {
        this.newUser = user;

        this.insertUserData2(userCredential);
      })
      .catch( error => {
        console.log("eroare la creare pacient");
        console.log(error);
        this.eventAuthError.next(error);
      });
  }

  insertUserData2(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`patients/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstname,
      lastname: this.newUser.lastname,
      role: 'user',
      doctorId: this.newUser.doctorId,
      id: userCredential.user.uid,
    });
  }

  createDoctor(doctor) {


    this.afAuth.createUserWithEmailAndPassword(doctor.email, doctor.password)
      .then( userCredential => {
        this.newDoctor = doctor;
        console.log(userCredential);

        this.insertUserData(userCredential);
      })
      .catch( error => {
        console.log("eroare la creare user");
        console.log(error);
        this.eventAuthError.next(error);
      });
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`doctors/${userCredential.user.uid}`).set({
      email: this.newDoctor.email,
      firstname: this.newDoctor.firstname,
      lastname: this.newDoctor.lastname,
      role: 'doctor',
      id: userCredential.user.uid
    });
  }

  logout() {
    sessionStorage.removeItem('user');
    this.afAuth.signOut();
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    if (sessionStorage.getItem('user') != null) {return true; } else { return false; }
  }

  isAdmin() {
    if (sessionStorage.getItem('user') === 'adminsupport@yahoo.com') {return true; } else { return false; }
  }






}
