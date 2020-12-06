import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  hide: boolean;
  passwordMessage: string;
  passwordNotMatch: string;
  password: string;
  Cpassword: string;
  sent: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.hide = true;
    this.passwordNotMatch = null;
    this.passwordMessage = null;
    this.sent = false;
  }

  change() {
    if (this.password === this.Cpassword) {
      this.authService.setPassword(this.password);
      this.passwordMessage = sessionStorage.getItem('passwordMessage');
      console.log(this.passwordMessage);
      this.sent = true;
    } else { this.passwordNotMatch = 'The passwords that you entered do not match,please try again!'; }

  }

}
