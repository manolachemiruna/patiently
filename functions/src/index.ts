//import * as functions from 'firebase-functions';

//require('dotenv').config();


const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
const cors=require('cors')({origin:true});
admin.initializeApp();


var transporter = nodemailer.createTransport({
  service:'gmail' ,
  auth: {
    user:"testcreatorplatform@gmail.com",
    pass:"dododeyutza08"
  }
 });


exports.sendEmail=functions.firestore
.document('appointments/{type}')
.onCreate((snap:any)=>{

  console.log("aici");
    //const email=snap.data().email;
    const link=snap.data().link;
    const date=snap.data().date;
    const todayDate=new Date();
    const hour=snap.data().hour;
    let message;

    if(link==null)message='There is no link for this meeting.';
    else message='Your link for the meeting is: '+link;

    const mailOptions = {
        from:'testcreatorplatform@gmail.com',
        to:'manolacheandreea22@yahoo.com',
        subject: 'Meeting with your doctor',
        html : `
        <div>From:Test Creator Platform</div>
        <div>Date: ${todayDate}</div>
        <p>You have a new meeting in ${date}, hour : ${hour}</p>
        <h2>${message}</h2>
        <a href="http://localhost:4200/">Find more info on our website!</a>
        <p>,Patiently team</p>
      `
    };


  transporter.sendMail(mailOptions, function (err: any, info: any) {
      if(err)
        console.log('eroare',err);
      else
        console.log("Yassss"+info.response);
   });


  });





