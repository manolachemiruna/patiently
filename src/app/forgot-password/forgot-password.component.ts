import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailToResetPassword: string;
  message = "Enter your email to reset your password!";
  emailMessage: string;
  sent: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.sent = false;
  }

  emailSent() {
    this.authService.sendPasswordResetRequest(this.emailToResetPassword)
    setTimeout(() =>{this.sent=true;this.emailMessage = sessionStorage.getItem('emailMessage');},1000);
    this.emailMessage = 'The email is sending...';
    console.log(this.emailMessage);
  }


}
