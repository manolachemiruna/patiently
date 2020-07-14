import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  message:string
  firstname:string
  lastname:string
  password:string
  Cpassword:string
  email:string
  constructor() { }

  ngOnInit(): void {
  }

}
