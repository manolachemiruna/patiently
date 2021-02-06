import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayAppointments } from 'src/app/entitites/DisplayAppointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-this-month',
  templateUrl: './this-month.component.html',
  styleUrls: ['./this-month.component.css']
})
export class ThisMonthComponent implements OnInit {


  @Input() displayNextAppointments: DisplayAppointments[];

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
