import { EkgService } from './../services/ekg.service';
import { AppointmentService } from './../services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { Appointment } from '../entitites/Appointment';
import { Subscription } from 'rxjs';
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
  labels=[];
  data1: Array<number>;
  data2: Array<number>;
  numberOfAppointments: number;
  noData: boolean;
  appointment: Appointment;
  subscription1 : Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;


  constructor(private route: ActivatedRoute,private userService: UserService,
     private messageService :MessageService, private appointmentService: AppointmentService, private ekg: EkgService,
     private router: Router,private dialog: MatDialog,) {
       this.labels = [];
   }

  ngOnInit(): void {

    this.subscription2 = new Subscription();
    this.noData=true;
    this.labels = [];
    let uid = sessionStorage.getItem('uid');
    this.subscription1=this.appointmentService.getAppointmentsByDoctor(uid).subscribe(appointments => this.numberOfAppointments = appointments.length);

    this.patient= new UserEmail();
    this.nullable=false;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id === undefined)
      {
        this.nullable = true;

      }
   });

   if(this.nullable === false)
   {
   this.subscription2=this.userService.getPatientById(this.id).subscribe
   (value =>
    {
       this.patient=value[0];
    });
  }
  else{
    this.patient = new UserEmail();
    this.patient.firstname='';
    this.patient.lastname='';
  }

    this.data1 = [];
    this.data2 = [];
    this.getEkgData();

  }


  ngOnDestroy()
  {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription3.unsubscribe();
    this.labels = [];
  }

  public getEkgData(): void
  {
        this.labels = [];
        this.subscription3=this.ekg.getDataByPatientId(this.id).subscribe(data =>{
        if(data.length>=2){

          this.data1=data[0].data;
          this.data2 = data[1].data;
          this.noData=false;
        }
        else if(data.length==1)
        {
          this.data1=data[0].data;
          this.data2=[];
          this.noData=false;
        }
        else if(data === []){
          this.noData=true;
        }

      if(this.noData === false)
      {

        let maxi= Math.max(this.data1.length, this.data2.length);
        for(let i=0;i<maxi;i++)this.labels.pop();
        for(let i=0;i<maxi;i++)this.labels.push('');

        console.log(this.labels.length);
        this.chartData= {
          labels: this.labels,
          datasets: [
              {
                  label: 'Now',
                  data: this.data1,
                  fill: false,
                  borderColor: '#4bc0c0'
              },
              {
                  label: 'Last time',
                  data: this.data2,
                  fill: false,
                  borderColor: '#565656'
              }
          ]
      }
    }
      });

  }

  public selectData(event) {

    this.messageService.add({sticky : true, summary: 'Data Selected', 'detail': this.chartData.datasets[event.element._datasetIndex].data[event.element._index]});
}

  goBack()
  {
    this.labels = [];
    this.ngOnDestroy();
    this.router.navigate(['/notifications']);
  }

  openNewRequestDialog(appointment): void {
    const doctorId = sessionStorage.getItem('uid');
    const patientId = this.id;
    const patientName = this.patient.lastname + ' ' + this.patient.firstname;
    this.dialog.open(RequestDialogComponent, {
       data: {
           appointment,
           doctorId,
           patientId,
           patientName
       }
   });
}



}
