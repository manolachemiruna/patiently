import { AppointmentService } from 'src/app/services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() numberOfAppointments: string;
  admin: boolean;
  loggedIn: boolean;
  meetingId:string;
  modalError:string;

  constructor(private auth: AuthService, private appointmentService:AppointmentService,private router:Router) { }

  ngOnInit(): void {

    this.modalError=null;
    this.admin = this.auth.isAdmin();
    if (this.auth.isLoggedIn()) { this.loggedIn = true; }
    else { this.loggedIn = false; }
  }

  joinMeeting()
  {
    let link;
    this.appointmentService.getAppointmentsById(this.meetingId.trim()).subscribe(appointments=>{
      console.log(appointments);
      if(appointments.length!=0){link=appointments[0].link;this.modalError=null;}
      if(link!=null){
        window.open(link);
      }
      else this.modalError='There is not meeting with this id!';
    });

  }

}
