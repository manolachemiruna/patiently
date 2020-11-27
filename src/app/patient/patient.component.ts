import { UserService } from './../services/user.service';
import { UserEmail } from './../entitites/UserEmail';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {User} from '../entitites/User';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  email: string;
  password: string;
  firstname: string;
  lastname: string;
  hide = true;
  search: string;
  searchedPatient: UserEmail[];
  patients;
  doctorId: string;
  message: string;
  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    sessionStorage.removeItem('message');
    this.message = null;
  }

  createPatient(email, password) {
     const user = new User();
     user.email = email;
     user.password = password;
     user.firstname = this.firstname;
     user.lastname = this.lastname;
     user.doctorId = this.doctorId;
     this.auth.createPatient(user);
     setTimeout(() => { this.message = sessionStorage.getItem('message'); }, 2000);
     console.log(this.message);
  }

  getPatients() {
    this.userService.getPatients().subscribe(
        patients => {
         this.patients = patients;
         console.log(patients);
      });
  }

  getPatientByEmail(email) {
    this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(patient => {
        this.searchedPatient = patient;
        console.log(this.searchedPatient);
        if (this.searchedPatient.length === 0) {
          this.message = 'There is no patient with this email!';
        } else { this.message = null; }
      });
  }

getPatientByName(fullName) {


  let fullname = fullName.replace(/\s/g, '');
  fullname = fullname.toUpperCase();
  const regex = new RegExp("^" + fullname + ".*");
  console.log(fullname);

  if (fullname !== '' && fullname != null) {
  this.userService.getPatients().pipe(
    map(v =>
      v.filter(user => (user.lastname + user.firstname).toUpperCase === fullname || (user.firstname + user.lastname).toUpperCase() === fullname || user.lastname.toUpperCase() === fullname || user.firstname.toUpperCase() === fullname || regex.test(user.lastname.toUpperCase()) || regex.test(user.firstname.toUpperCase()) || regex.test((user.lastname + user.firstname).toUpperCase()) || regex.test((user.firstname + user.lastname).toUpperCase()))
     )
  ).subscribe(patient => {
      this.searchedPatient = patient;
      console.log(this.searchedPatient);
      if (this.searchedPatient.length === 0) {
        this.message = 'There is no patient with this name!';
      } else { this.message = null; }
    });
  }
}

getPatientByInput(input) {
  const regex1 = new RegExp('^.*@yahoo.com$');
  const regex2 = new RegExp('^.*@gmail.com$');
  const fullname = input.replace(/\s/g, '');
  const email = input.replace(/\s/g, '');
  if (regex1.test(email) || regex1.test(email)) {this.getPatientByEmail(email); } else { this.getPatientByName(fullname); }
}

  deletePatient(patient) {
    this.userService.deletePatient(patient);
  }
}
