import { RequestDialogComponent } from './../request-dialog/request-dialog.component';
import { Component, OnInit, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: Array<string> = new Array<string>();
  sendMessage: boolean = false;
  message: string;
  selectedId: number = 1;
  appointment: any;


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.notifications.push('aaa');
    this.notifications.push('bbb');
    this.notifications.push('ccc');
    this.notifications.push('ddd');
  }

  onClickSendMessage() {
    this.sendMessage = true;
  }

  send() {
    this.sendMessage = false;
  }

  isSelected(id: number) {
    return id === this.selectedId;
  }

  openNewRequestDialog(appointment): void {
    this.dialog.open(RequestDialogComponent, {
        data: {
            appointment
        }

    });
}


}
