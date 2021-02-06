import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/entitites/Appointment';
import { DisplayAppointments } from 'src/app/entitites/DisplayAppointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {


   @Input() displayAppointments: DisplayAppointments[];


  constructor(private appointmentService: AppointmentService, private userService: UserService,private router: Router) {}

  ngOnInit(): void {

  }

  public markAsDone(id: string): void {
    this.appointmentService.deleteAppointment(id);
  }

  public videoType(type: string): boolean {

    if(type === 'video appointment')return true;
    else return false;
  }


}
