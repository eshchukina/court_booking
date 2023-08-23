import React, { useState, useEffect } from "react";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faHouse, faCircleInfo, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import "./Style.css";
import "./Dashboard.css";
import "./Info.css";




const Info = ({
  isDarkMode,
  toggleTheme,
  setCurrentComponent 
 

}) => { 


 





  return (
 

    <div className={`info ${isDarkMode ? "dark" : "light"}`}>
       <div className="container">




       
       <div className="wrapper-dashboard">
   
   
  

       <div className="info-wrapper">
<h2 className="textInfo"> Tennis Court Booking App</h2>
      <p className="textInfo">

      The Tennis Court Booking App is your ultimate companion for
       effortless tennis court reservations. 


</p>

<p className="textInfo">

Easy Reservations: With just a few taps, you can reserve your
 desired tennis court for a specific day and tim


</p>
<p className="textInfo">

The app enables you to cancel your bookings hassle-free. This flexibility
 ensures that your tennis plans align with your schedule.


</p>
  
<p className="textInfo">

Daily Booking Limit: To give everyone a fair chance to enjoy the courts, users are 
allowed to make a maximum of two hours of bookings per day. This limit applies regardless
 of whether the bookings are for a single court or multiple courts. 
   {/* <div className="sidemenu-itemFooter"
   onClick={() => setCurrentComponent('Dashboard')}>
 
  start booking
  </div> */}


</p>


<p className="textInfo">

Booking History: Keep track of all your past and upcoming court reservations in
 one place. The booking history feature  you review your previous matches and
  plan your future games accordingly. 



</p>
  </div>  

       </div></div></div>


     
    
   
    
  );
};
export default Info;
