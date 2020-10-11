import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  hide = true;
  message = "Enter your email to reset your password!";
  forgotPassword: boolean;
  emailToResetPassword: string;
  sent: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {

    this.forgotPassword = false;

  }

  onClick() {
    if (this.forgotPassword === true) { this.forgotPassword = false; } else { this.forgotPassword = true; }
  }

  emailSent() {
    this.message = "Email successfully sent!";
    this.sent = true;
  }

}
