import { Message } from './../entitites/Message';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  messages: Observable<Message[]>;
  messsagesCollection: AngularFirestoreCollection<Message>;
  messagesDoc: AngularFirestoreDocument<Message>;

  constructor(private db: AngularFirestore) { }

  addMessage(id, message) {
    let m = new Message();
    m.patientId = id;
    m.message = message;
    this.insertMessage(m);
  }

  insertMessage(message: Message) {
    return this.db.collection(`messages`).add({
     patientId: message.patientId,
     message: message.message
    });
  }
}
