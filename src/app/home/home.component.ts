import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: any;

  constructor() { }

  ngOnInit(): void {

    this.images = ["https://osm.no/app/uploads/2020/02/iStock-1165067633-copy-850x537.jpg","https://www.stockvault.net/data/2011/10/11/127462/preview16.jpg","https://cdn.pixabay.com/photo/2018/07/15/10/44/dna-3539309_960_720.jpg","https://gulf-insider-i35ch33zpu3sxik.stackpathdns.com/wp-content/uploads/2020/03/emrecord.jpg","https://www.europeanceo.com/wp-content/uploads/2015/12/heart-of-the-matter.jpg"];
  }

}
