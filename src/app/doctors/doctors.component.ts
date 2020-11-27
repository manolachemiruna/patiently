import { LoginComponent } from './../login/login.component';
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
  searchedDoctor: DoctorEmail[];
  message: string;
  foundDoctors: any;
  found: boolean;
  deSpecialitate: boolean;
  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    sessionStorage.removeItem('message');
    this.message = null;
    this.found = false;
    this.deSpecialitate = false;
  }

  createDoctor(email, password) {

    const regex1 = new RegExp(' -|- ');
    this.message = null;
    this.found = false;
    this.deSpecialitate = false;
    let nume = this.lastname.replace(/\s+/g, ' ');
    let prenume = this.firstname.replace(/\s+/g, ' ');
    nume = nume.trim();
    prenume = prenume.trim();
    nume = nume.replace('- ', '-');
    prenume = prenume.replace('- ', '-');
    nume = nume.replace(' -', '-');
    prenume = prenume.replace(' -', '-');

    console.log(nume.toUpperCase() + " " + prenume.toUpperCase());
    this.userService.getDoctorFromRegistry(prenume, nume).subscribe(doctors => {
        this.foundDoctors = doctors;
        console.log(this.foundDoctors.results);
        for (const doc of this.foundDoctors.results) {
          doc.nume = doc.nume.replace(' - ', '-');
          doc.prenume = doc.nume.replace(' - ', '-');
          if (doc.nume.toUpperCase() === nume.toUpperCase() && doc.prenume.toUpperCase() === prenume.toUpperCase() && doc.status === "Activ") {
            const specialitati = doc.specialitati;
            this.found = true;
            for ( const s of specialitati) {
              if (s.nume === "CARDIOLOGIE") {

                  this.deSpecialitate = true;
                  const doctor = new Doctor();
                  doctor.email = email;
                  doctor.password = password;
                  doctor.lastname = nume;
                  doctor.firstname = prenume;
                  this.auth.createDoctor(doctor);
                  setTimeout(() => { this.message = sessionStorage.getItem('message'); }, 2000);
                  console.log(this.message);
                }
               }
            }

         }
        if (this.found === false) {
           this.message = 'There is no active doctor with this name!';
           console.log(this.message);
         } else if (this.deSpecialitate === false) {
          this.message = 'The doctor you are looking for is not a cardiologist!';
          console.log(this.message);
        }
      });

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
        this.searchedDoctor = doctor;
        console.log(this.searchedDoctor);
        if (this.searchedDoctor.length === 0) {
          this.message = 'There is no doctor with this email!';
        } else { this.message = null; }
      });
  }

getDoctorByName(fullName) {

  let fullname = fullName.replace(/\s/g, '');
  fullname = fullname.toUpperCase();
  const regex = new RegExp("^" + fullname + ".*");
  console.log(fullname);

  if (fullname !== '' && fullname != null) {
  this.userService.getDoctors().pipe(
    map(v =>
     v.filter(user => (user.lastname + user.firstname).toUpperCase === fullname || (user.firstname + user.lastname).toUpperCase() === fullname || user.lastname.toUpperCase() === fullname || user.firstname.toUpperCase() === fullname || regex.test(user.lastname.toUpperCase()) || regex.test(user.firstname.toUpperCase()) || regex.test((user.lastname + user.firstname).toUpperCase()) || regex.test((user.firstname + user.lastname).toUpperCase()))
    )
  ).subscribe(doctor => {
      this.searchedDoctor = doctor;
      console.log(this.searchedDoctor);
      if (this.searchedDoctor.length === 0) {
        this.message = 'There is no doctor with this name!';
      } else { this.message = null; }
    });
  }
}

getDoctorByInput(input) {
  const regex1 = new RegExp('^.*@yahoo.com$');
  const regex2 = new RegExp('^.*@gmail.com$');
  const fullname = input.replace(/\s/g, '');
  const email = input.replace(/\s/g, '');
  if (regex1.test(email) || regex1.test(email)) {this.getDoctorByEmail(email); } else { this.getDoctorByName(fullname); }
}

}
