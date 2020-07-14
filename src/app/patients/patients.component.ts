import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients:Array<String>=new Array<String>();
  curentPage=1;
  currentIndex=0;
  patientsOnCurrentPage:Array<String>=new Array<String>();
  
  constructor() { }

  ngOnInit(): void {

    this.patients=["ana","ion","ghita","popa","miruna","mara","ruxi","mami","tati","buni","cutu","tataia","aaaa"];

    this.patientsOnCurrentPage.push(this.patients[this.curentPage-1]);
    this.patientsOnCurrentPage.push(this.patients[this.curentPage]);
    this.patientsOnCurrentPage.push(this.patients[this.curentPage+1]);
    this.currentIndex+=3;
  }


  nextPage()
  {
  
    
    let i;
    let contor;
    let copyCurrentIndex=this.currentIndex;

    if(Number.isInteger(this.patients.length/3))contor=this.patients.length/3;
    else contor=Math.trunc(this.patients.length/3)+1;

    

    if(this.curentPage<contor)
    {
      
      for(i=0;i<=this.patientsOnCurrentPage.length+1;i++)
      {
        this.patientsOnCurrentPage.pop();
      }

      for(i=copyCurrentIndex;i<copyCurrentIndex+3;i++)
      {
        if(this.patients[i]!=undefined)
        {
          this.patientsOnCurrentPage.push(this.patients[i]);
          this.currentIndex++;

        }
      }
      
    
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


    if(Number.isInteger(this.patients.length/3))contor=this.patients.length/3;
    else contor=Math.trunc(this.patients.length/3)+1;

    let copyCurrentIndex=this.currentIndex;

    let i;

    let n=this.patientsOnCurrentPage.length;

    if(this.curentPage >1 && this.curentPage <=contor)
    {
      for(i=0;i<=this.patientsOnCurrentPage.length+1;i++)
      {
        this.patientsOnCurrentPage.pop();
      }

      console.log(this.currentIndex);

     if(n<3)
     { for(i=copyCurrentIndex-n-1;i>=copyCurrentIndex-n-3;i--)
      {
        if(this.patients[i]!=undefined)
        {
          this.patientsOnCurrentPage.push(this.patients[i]);
          this.currentIndex--;

        }
      }
      this.currentIndex++;
    }

    else
    {
      for(i=copyCurrentIndex-3;i>copyCurrentIndex-6;i--)
      {
        if(this.patients[i]!=undefined)
        {
          this.patientsOnCurrentPage.push(this.patients[i]);
          this.currentIndex--;

        }
      }

    }

    if(this.curentPage==2)this.currentIndex=3;

      console.log(this.currentIndex);
      console.log(this.curentPage);
    
    
      this.curentPage--;

    }

    else 
    {
      var element = <HTMLInputElement> document.getElementById("previous");
      element.disabled = true;
    }


  }


}
