import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

   getNumberOfNotifications(): number {
     return 2;
   }
}
