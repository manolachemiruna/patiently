import { EkgService } from './../services/ekg.service';
import { AppointmentService } from './../services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEmail } from './../entitites/UserEmail';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
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
  ApexTooltip,
  ApexGrid,
  ApexAnnotations
} from "ng-apexcharts";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  id:string;
  patient: UserEmail;
  nullable: boolean;
  labels=[];
  data1: any;
  notes:string;
  ekgId:string;
  dates:Array<any>;
  selectedDate:any;
  numberOfAppointments: number;
  noData: boolean;
  appointment: Appointment;
  public progressSpinner:boolean;
  message:string;
  xAxis:Array<number>;

  subscription1 : Subscription;
  subscription2 : Subscription;
  subscription3 : Subscription;
  subscription4 : Subscription;

  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  public grid:ApexGrid;
  public annotations:ApexAnnotations;



  constructor(private route: ActivatedRoute,private userService: UserService,
     private appointmentService: AppointmentService, private ekg: EkgService,
     private router: Router,private dialog: MatDialog,) {

   }

  ngOnInit(): void {


    this.xAxis=[];
    this.initializeValues();
    this.subscription2 = new Subscription();
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

    this.getEkgData();

  }


  ngOnDestroy()
  {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription3.unsubscribe();
    if(this.subscription4!=undefined)this.subscription4.unsubscribe();
    this.labels = [];
  }

  public getEkgData(): void
  {
        this.initializeValues();
        let ts2 = 0;

        this.subscription3=this.ekg.getDataByPatientId(this.id).subscribe(data =>{
          this.progressSpinner=false;

          for(let i=0; i<data.length;i++)
          {
            this.dates.push({value:data[i].id,date:data[i].date});
          }

          sessionStorage.setItem('dates',JSON.stringify(this.dates));
          this.ekgId=data[data.length-1].id;
          this.notes=data[data.length-1].notes;

          for( let i=0;i<data[data.length-1].data.length;i++)
          {
            if(data[data.length-1].data[i] !=null)
            {
              this.data1.push([ts2,data[data.length-1].data[i]]);
              ts2 = ts2+0.007;
            }

          }

          this.series = [
            {
              name: "Value",
              data: this.data1,
            }
          ];


        if(data !== [] && data!==undefined){
          this.noData=false;
        }

        this.setChart();

      });
  }


  public goBack():void
  {
    this.labels = [];
    this.ngOnDestroy();
    this.router.navigate(['/notifications']);
  }

  public openNewRequestDialog(appointment): void {
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
  getEkgByDate()
  {
    this.initializeValues();
    this.dates=JSON.parse(sessionStorage.getItem('dates'));
    let ts2 = 0;
    console.log("getting data by date");

    if(this.selectedDate.date!=null)
    {
      this.subscription4=this.ekg.getDataByPatientIdAndDate(this.id, this.selectedDate.date).subscribe(data =>{

        this.progressSpinner=false;

        let max=Math.max(...data[0].data);
        console.log(max);

        this.ekgId=data[0].id;
        this.notes=data[0].notes;
        for( let i=0;i<data[0].data.length;i++)
        {
          if(data[0].data[i] !=0)
          {
            this.data1.push([ts2,data[0].data[i]]);
            ts2 = ts2 + 0.07;
          }
        }
        console.log(ts2);

        this.series = [
          {
            name: "Value",
            data: this.data1
          }
        ];


      if(data !== [] && data!==undefined){
        this.noData=false;
      }

      this.setChart();
    });
    }
  }

  public insertNotes():void
  {
    this.ngOnDestroy();
    console.log("getting data after insert");
    this.ekg.insertNotes(this.ekgId,this.notes);
    this.message="Your notes were saved!";
  }

  private initializeValues():void
  {
    this.progressSpinner=true;
    this.noData=true;
    this.data1=[];
    this.labels = [];
    this.message=null;
    this.dates=new Array<any>();
    this.dates=[];
  }


  private setChart():void
  {
    this.chart = {
      type: "area",
      stacked: false,
      height: 450,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      },
    };

    this.grid={
      show:true,
      xaxis: {
        lines: {
            show: true
        },

    },
    yaxis: {
        lines: {
            show: true
        }
    },
    }

    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0,
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
          return (val).toFixed();
        }
      },
      title: {
        text: "Amplitude(milivolts)",
        style: {
          color: 'black',
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
      },
      },
    };
    this.xaxis = {
    type: 'numeric',
    title: {
      text: "Time(seconds)",
      style: {
        color: 'black',
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-title',
    },
    },
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val).toFixed(0);
        }
      },
      x: {
        formatter: function(val) {
          return (val).toFixed(2);
        }
      }
    };
  }

  public navigate()
  {
    this.router.navigate(['/pulse',this.id]);
  }
}
