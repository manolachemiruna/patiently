import { DoctorEmail } from './../entitites/DoctorEmail';
import { AuthService } from './../services/auth.service';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { User } from './../entitites/User';
import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
/* tslint:disable */

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients: any;
  curentPage = 1;
  currentIndex = 0;
  patientsOnCurrentPage=new Array();
  disease:string;
  closeResult = '';
  search: string;
  doctor: DoctorEmail;

  constructor(private modalService:NgbModal,private userService: UserService,private auth:AuthService) { }

  ngOnInit(): void {

     const email=sessionStorage.getItem('user');
     this.userService.getDoctors().pipe(
      map(v =>
       v.filter(user => user.email === email)
      )
    ).subscribe(doctor =>
      {
        this.doctor = doctor[0];
      });

     this.userService.getPatients().pipe(
      map(v =>
       v.filter(user => user.doctorId === this.doctor.id)
      )
    ).subscribe(patient =>
      {
        this.patients=patient;
        console.log(this.patients[0]);
        this.patientsOnCurrentPage.push(this.patients[this.curentPage - 1]);
        this.patientsOnCurrentPage.push(this.patients[this.curentPage]);
        this.patientsOnCurrentPage.push(this.patients[this.curentPage + 1]);
        console.log(this.patientsOnCurrentPage);
      });



  }


  nextPage()
  {


    let contor;

    let patient= this.patientsOnCurrentPage[0];
    let index=this.patients.indexOf(patient);//iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor=index+this.patientsOnCurrentPage.length;
    console.log(index);
    let co=contor+3;


    if(index<this.patients.length && index>=0 && this.patientsOnCurrentPage.length==3)
    {
      for(let i=0;i<=5;i++)this.patientsOnCurrentPage.pop();
      console.log(this.patientsOnCurrentPage);
      for(let i=contor;i<co;i++)if(this.patients[i]!=undefined)this.patientsOnCurrentPage.push(this.patients[i]);
      console.log(this.patientsOnCurrentPage);
      this.curentPage++;
    }
    else
    {
      var element = <HTMLInputElement> document.getElementById("next");
      element.disabled = true;
    }



  }


  previousPage()
  {

    let contor;

    let patient= this.patientsOnCurrentPage[0];
    let index=this.patients.indexOf(patient);//iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor=index-this.patientsOnCurrentPage.length;
    let co=index-3;


    if(index>0)
    {
      for(let i=0;i<=5;i++)this.patientsOnCurrentPage.pop();
      for(let i=co;i<index;i++)this.patientsOnCurrentPage.push(this.patients[i]);
      console.log(this.patientsOnCurrentPage);
      this.curentPage--;
    }
    else
    {
      var element = <HTMLInputElement> document.getElementById("previous");
      element.disabled = true;
    }


  }

  searchPatient()
  {

  }

  isDoctor()
  {
    return !this.auth.isAdmin();
  }


}
