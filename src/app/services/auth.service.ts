import { Doctor } from './../entitites/Doctor';
import {Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router} from '@angular/router';
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
  message: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,) {}



  getUserState() {

    return this.afAuth.authState;
  }

  login( email: string, password: string) {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          localStorage.setItem('message','Please enter a valid email address!');
      } else if (error.code === 'auth/user-not-found') {
         localStorage.setItem('message','There is no user coresponding to this identifier!');
      } else if (error.code === 'auth/wrong-password') {
          localStorage.setItem('message','The password is invalid or the user does not have a password!');
      }
      })
      .then(userCredential => {
        if (userCredential) {
          sessionStorage.setItem('user', email);
          localStorage.removeItem('message');
          if (this.isAdmin()) { this.router.navigate(['/admin']); } else { this.router.navigate(['/appointments']); }
        }
      });


  }
  createPatient(user) {

    console.log(user);

    this.afAuth.createUserWithEmailAndPassword( user.email, user.password)
      .then( userCredential => {
        this.newUser = user;
        this.insertUserData2(userCredential);
        sessionStorage.setItem('message', 'Patient successfully  created!');

      })
      .catch( error => {
        console.log("eroare la creare pacient");
        console.log(error);
        this.eventAuthError.next(error);
        sessionStorage.setItem('message', error.message);
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
        sessionStorage.setItem('message', 'Doctor successfully  created!');
      })
      .catch( error => {
        console.log("eroare la creare user");
        console.log(error);
        this.eventAuthError.next(error);
        sessionStorage.setItem('message', error.message);
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
    sessionStorage.removeItem('numberOfAppointments');
    this.afAuth.signOut();
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    if (sessionStorage.getItem('user') != null) {return true; } else {
      return false; }
  }

  isAdmin() {
    if (sessionStorage.getItem('user') === 'adminsupport@yahoo.com') {return true; } else { return false; }
  }

  sendPasswordResetRequest(email)
 {

    return this.afAuth.sendPasswordResetEmail(email).then(
      () => {
        sessionStorage.setItem('emailMessage', "Email successfully sent!");
        console.log("Email sent");
      },
       error => {
          this.eventAuthError.next(error);
          sessionStorage.setItem('emailMessage', "An error occured while trying to send you the email.Please try again later!");
      }
    );
 }

 setPassword(password)
{

const code = this.route.snapshot.queryParams['oobCode'];

this.afAuth.confirmPasswordReset(code, password)
  .then(
    () => {
      console.log("Password Changed");
      sessionStorage.setItem('passwordMessage', "Password successfully changed!");
    },
  error => {
    this.eventAuthError.next(error);
    sessionStorage.setItem('passwordMessage', "An error occured while changing your password,please try again!");
  }
  );

}










}
