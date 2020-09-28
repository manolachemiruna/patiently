import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  message: string;
  firstname: string;
  lastname: string;
  password: string;
  Cpassword: string;
  email: string;
  closeResult: string;
  numbers=["Heart Rate","EKG"]
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  isEKG(p)
  {
    if (p === "EKG") { return true; } else { return false; }
  }

}
