import { ActivatedRoute } from '@angular/router';

import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
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
  chartData:any;

  constructor(private route: ActivatedRoute,private userService: UserService, private messageService :MessageService) {
   }

  ngOnInit(): void {

    this.chartData= {
      labels: [' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' '],
      datasets: [
          {
              label: 'Now',
              data: [65, 59, 80, 81, 56, 55, 40,42,56,67,70,65,64],
              fill: false,
              borderColor: '#4bc0c0'
          },
          {
              label: 'Last time',
              data: [28, 48, 40, 19, 86, 27, 90,30,30,21,23,24,45],
              fill: false,
              borderColor: '#565656'
          }
      ]
  }
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
  selectData(event) {
    this.messageService.add({severity: 'info', summary: 'Data Selected', 'detail': this.chartData.datasets[event.element._datasetIndex].data[event.element._index]});
}



}
