
import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import { User } from 'src/app/entitites/User';
import { UserEmail } from 'src/app/entitites/UserEmail';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
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
  hide: boolean;
  search: string;
  searchedPatient: UserEmail[];
  patients: any;
  doctorId: string;
  message: string;
  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.hide = true;
    sessionStorage.removeItem('message');
    this.message = null;
  }

  public createPatient(email: string, password: string): void {

     const user = new User();
     user.email = email;
     user.password = password;
     user.firstname = this.firstname;
     user.lastname = this.lastname;
     user.doctorId = this.doctorId;
     this.auth.createPatient(user);
     setTimeout(() => { this.message = sessionStorage.getItem('message'); }, 2000);
  }

  public getPatientByEmail(email: string): void {

    this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(patient => {
        this.searchedPatient = patient;
        if (this.searchedPatient.length === 0) {
          this.message = 'There is no patient with this email!';
        } else { this.message = null; }
      });
  }

  public getPatientByName(fullName: string): void {


    let fullname = fullName.replace(/\s/g, '');
    fullname = fullname.toUpperCase();
    const regex = new RegExp("^" + fullname + ".*");

    if (fullname !== '' && fullname != null) {
    this.userService.getPatients().pipe(
      map(v =>
        v.filter(user => (user.lastname + user.firstname).toUpperCase() === fullname || (user.firstname + user.lastname).toUpperCase() === fullname || user.lastname.toUpperCase() === fullname || user.firstname.toUpperCase() === fullname || regex.test(user.lastname.toUpperCase()) || regex.test(user.firstname.toUpperCase()) || regex.test((user.lastname + user.firstname).toUpperCase()) || regex.test((user.firstname + user.lastname).toUpperCase()))
      )
    ).subscribe(patient => {
        this.searchedPatient = patient;
        if (this.searchedPatient.length === 0) {
          this.message = 'There is no patient with this name!';
        } else { this.message = null; }
      });
    }
  }

  public getPatientByInput(input: string): void{

    const regex1 = new RegExp('^.*@yahoo.com$');
    const regex2 = new RegExp('^.*@gmail.com$');
    const fullname = input.replace(/\s/g, '');
    const email = input.replace(/\s/g, '');
    if (regex1.test(email) || regex1.test(email)) {this.getPatientByEmail(email); } else { this.getPatientByName(fullname); }
  }

    public deletePatient(patient: any): void{

      this.userService.deletePatient(patient);
    }
}
