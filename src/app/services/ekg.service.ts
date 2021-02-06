import { EkgData } from './../entitites/EkgData';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EkgService {

  ekgCollection: AngularFirestoreCollection<EkgData>;
  ekg: Observable<EkgData[]>;
  ekgDoc: AngularFirestoreDocument<EkgData>;


  constructor(private db: AngularFirestore) {

    this.ekgCollection = this.db.collection<EkgData>('ekg',ref => ref.orderBy('date','desc'));
    this.ekg = this.ekgCollection.snapshotChanges().pipe(
      map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as EkgData;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    })
    );
   }

  public getAllData(): Observable<EkgData[]>
  {
    return this.ekg;
  }

  public getDataByPatientId(id: string) :Observable<EkgData[]>
  {
    return this.getAllData().pipe(
      map(p => p.filter(ekg => ekg.patientId === id))
    );
  }
}
