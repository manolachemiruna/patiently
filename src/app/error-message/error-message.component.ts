import { Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit{

  @Input() message:string;

  constructor() { }

  ngOnInit(): void {
  }


}
