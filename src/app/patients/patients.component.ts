import { ActivatedRoute } from '@angular/router';

import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
/* tslint:disable */

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  id:string;
  patient: UserEmail;
  nullable: boolean;
  message: string;

  constructor(private route: ActivatedRoute,private userService: UserService) {
   }

  ngOnInit(): void {

    this.patient= new UserEmail();
    this.nullable=false;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id === undefined)
      {
        this.nullable = true;

      }
      console.log(this.id);
   });

   if(this.nullable === false)
   {
   this.userService.getPatientById(this.id).subscribe
   (value =>
    {
       this.patient=value[0];
       console.log(this.patient);
    });
  }
  else{
    this.patient = new UserEmail();
    this.patient.firstname='';
    this.patient.lastname='';
  }

  }


}
