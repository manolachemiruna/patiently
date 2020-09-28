import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable */

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients: Array<string> = new Array <string>();
  curentPage = 1;
  currentIndex = 0;
  patientsOnCurrentPage: Array<string> = new Array<string>();
  disease:string;
  closeResult = '';

  constructor(private modalService:NgbModal) { }

  ngOnInit(): void {


    this.patients = ["ana", "ion", "ghita", "popa", "miruna", "mara", "ruxi", "mami", "tati", "buni", "cutu", "tataia", "aaaa"];

    this.patientsOnCurrentPage.push(this.patients[this.curentPage - 1]);
    this.patientsOnCurrentPage.push(this.patients[this.curentPage]);
    this.patientsOnCurrentPage.push(this.patients[this.curentPage + 1]);

  }


  nextPage()
  {


    let contor;

    let patient= this.patientsOnCurrentPage[0];
    let index=this.patients.indexOf(patient);//iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor=index+this.patientsOnCurrentPage.length;
    console.log(index);
    let co=contor+3;


    if(index<this.patients.length && index>=0 && this.patientsOnCurrentPage.length==3)
    {
      for(let i=0;i<=5;i++)this.patientsOnCurrentPage.pop();
      console.log(this.patientsOnCurrentPage);
      for(let i=contor;i<co;i++)if(this.patients[i]!=undefined)this.patientsOnCurrentPage.push(this.patients[i]);
      console.log(this.patientsOnCurrentPage);
      this.curentPage++;
    }
    else
    {
      var element = <HTMLInputElement> document.getElementById("next");
      element.disabled = true;
    }



  }


  previousPage()
  {

    let contor;

    let patient= this.patientsOnCurrentPage[0];
    let index=this.patients.indexOf(patient);//iau indexul din vectorul mare al primul pacient pe pagina curenta
    contor=index-this.patientsOnCurrentPage.length;
    let co=index-3;


    if(index>0)
    {
      for(let i=0;i<=5;i++)this.patientsOnCurrentPage.pop();
      for(let i=co;i<index;i++)this.patientsOnCurrentPage.push(this.patients[i]);
      console.log(this.patientsOnCurrentPage);
      this.curentPage--;
    }
    else
    {
      var element = <HTMLInputElement> document.getElementById("previous");
      element.disabled = true;
    }


  }

  open(content) {
    console.log("aaaaa");
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
