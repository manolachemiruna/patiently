import { DoctorEmail } from './../entitites/DoctorEmail';
import { Doctor } from './../entitites/Doctor';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {delay, map} from 'rxjs/operators';
@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  email: string;
  password: string;
  hide = true;
  search: string;
  doctors;
  patients;
  firstname: string;
  lastname: string;
  searchedDoctor: DoctorEmail;
  message: string;
  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    sessionStorage.removeItem('message');
    this.message = null;
  }

  createDoctor(email, password) {
     const doctor = new Doctor();
     doctor.email = email;
     doctor.password = password;
     doctor.lastname = this.lastname;
     doctor.firstname = this.firstname;
     this.auth.createDoctor(doctor);
     setTimeout(() => { this.message = sessionStorage.getItem('message'); }, 2000);
     console.log(this.message);
  }

  getDoctors() {
    this.userService.getDoctors().subscribe(doctors => {
     this.doctors = doctors;
     console.log(doctors);
    });
  }
  getDoctorByEmail(email) {
    this.userService.getDoctors().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(doctor => {
        this.searchedDoctor = doctor[0];
        console.log(this.searchedDoctor);
      });
  }

}
