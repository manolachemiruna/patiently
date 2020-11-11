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
  searchedPatient: UserEmail;
  patients;
  doctorId: string;
  message: string;
  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    sessionStorage.removeItem('message');
    this.message = null;
  }

  createPatient(email, password)
  {
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

  getPatients()
  {
    this.userService.getPatients().subscribe(
        patients =>
      {
         this.patients = patients;
         console.log(patients);
      });
  }

  getPatientByEmail(email)
  {

    this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(patient =>
      {
        this.searchedPatient = patient[0];
        console.log(patient[0]);
      });
  }

  deletePatient(patient)
  {
    this.userService.deletePatient(patient);
  }
}
