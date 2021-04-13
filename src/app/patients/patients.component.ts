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
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
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
  data1: any;
  numberOfAppointments: number;
  noData: boolean;
  appointment: Appointment;
  subscription1 : Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;

  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  public progressSpinner:boolean;


  constructor(private route: ActivatedRoute,private userService: UserService,
     private messageService :MessageService, private appointmentService: AppointmentService, private ekg: EkgService,
     private router: Router,private dialog: MatDialog,) {

       this.labels = [];
   }

  ngOnInit(): void {

    this.progressSpinner=true;
    this.subscription2 = new Subscription();
    this.noData=true;
    this.labels = [];
    this.data1=[];
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
        let ts2 = 0;
        this.subscription3=this.ekg.getDataByPatientId(this.id).subscribe(data =>{


          this.progressSpinner=false;
          for( let i=0;i<data[0].data.length;i++)
          {
            if(data[0].data[i] !=0)this.data1.push([ts2,data[0].data[i]]);
            ts2 = ts2 + 0.03;
          }
          this.series = [
            {
              name: "Value",
              data: this.data1
            }
          ];


        if(data !== [] && data!==undefined){
          this.noData=false;
        }



        this.chart = {
          type: "area",
          stacked: false,
          height: 350,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: "zoom"
          }
        };


        this.dataLabels = {
          enabled: false
        };
        this.markers = {
          size: 0
        };
        this.title = {
          text: "",
          align: "left"
        };
        this.fill = {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        };
        this.yaxis = {
          labels: {
            formatter: function(val) {
              return (val).toFixed(0);
            }
          },
          title: {
            text: ""
          }
        };
        this.xaxis = {
          type: "numeric"
        };
        this.tooltip = {
          shared: false,
          y: {
            formatter: function(val) {
              return (val).toFixed(0);
            }
          }
        };

      });
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
