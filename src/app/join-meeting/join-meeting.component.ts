import { AppointmentService } from './../services/appointment.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EkgService } from '../services/ekg.service';
import { IPointEventArgs } from '@syncfusion/ej2-angular-charts';
import { UserEmail } from '../entitites/UserEmail';

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent implements OnInit {

  chartData;
  primaryXAxis;
  primaryYAxis
  id:string;
  nullable: boolean;
  data:Array<any>;
  tooltip;
  selectedData;
  zoom;
  marker;
  val;
  selectionMode;
  arrayToCalculate=[];
  modalError:string;
  sall:number;
  patient:UserEmail;
  numberOfAppointments:number;

  public dragComplete(args: IPointEventArgs):void {
  console.log(args);
   this.arrayToCalculate.push(this.chartData[args.pointIndex]);
   if(this.arrayToCalculate.length==2)this.val=parseFloat(this.arrayToCalculate[1].month)-parseFloat(this.arrayToCalculate[0].month);
  }

  constructor(private ekg: EkgService,private route: ActivatedRoute, private userService:UserService,
    private appointmentService:AppointmentService) { }

  ngOnInit(): void {

    this.getDataAboutPatient();

    this.sall=0;
    this.modalError=null;
    this.arrayToCalculate=[];
    this.zoom = {
      enableMouseWheelZooming: true,
      enablePinchZooming: true,
      enableSelectionZooming: true,
      mode: 'X',
      enablePan: true
  };

    this.tooltip = {
      enable: true
  }
    this.data=[];
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id === undefined)
      {
        this.nullable = true;

      }
   });
    this.ekg.getDataByPatientId(this.id).subscribe(data =>{

      let ts=0;
      for(let i=0; i<data[data.length-1].data.length;i++)
      {
        this.data.push({month:ts.toFixed(2),sales:data[data.length-1].data[i]});
        ts+=0.025;
        this.sall+=parseInt(data[data.length-1].data[i].length);
      }
      this.chartData = this.data
      console.log(this.chartData);
    });

    this.marker = { visible: true };
    this.primaryXAxis = {
      title: 'Time(seconds)',
      valueType: 'Double',
      rangePadding: 'Round',
      zoomFactor: 0.2, zoomPosition: 0.6
   };
   this.primaryYAxis = {
      title: 'Aplitude(milivolts)',
   };
   this.selectionMode = 'Point';



   this.chartData = this.selectedData;
   console.log(this.selectedData);
  }

  public calculatePulse()
  {
    if(this.arrayToCalculate.length<2)
    {
      this.modalError='Please select 2 QRS complexes to calculate pulse!';
      this.val=0;
    }
    else{
      this.val=(60/(parseFloat(this.arrayToCalculate[this.arrayToCalculate.length-1].month)-parseFloat(this.arrayToCalculate[this.arrayToCalculate.length-2].month))).toFixed(2);
      this.modalError=null;
      }

    this.arrayToCalculate=[];
  }

  getDataAboutPatient()
  {
    let uid = sessionStorage.getItem('uid');
    this.appointmentService.getAppointmentsByDoctor(uid).subscribe(appointments => this.numberOfAppointments = appointments.length);

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
    this.userService.getPatientById(this.id).subscribe
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
  }

}
