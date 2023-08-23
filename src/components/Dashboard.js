import React, { useState, useEffect } from "react";




import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock } from "@fortawesome/free-solid-svg-icons";

import "./Style.css";
import "./Dashboard.css";





const Dashboard = ({
  isDarkMode,
  account,
 

}) => { 

  const [showFireworks, setShowFireworks] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingFail, setBookingFail] = useState(false);


  const [selectedCourt, setSelectedCourt] = useState("");
  const [courtOptions, setCourtOptions] = useState([]); // New state variable for court options

  const [selectedDay, setSelectedDay] = useState(""); 
  const [selectedHour, setSelectedHour] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [reservationData, setReservationData] = useState([]);





  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isModalOpen && e.target.classList.contains("modalWindow")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);





  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headersWithToken = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
     
      const response = await fetch("http://192.168.1.30:91/courts", {
        headers: headersWithToken,
      });


      
      if (!response.ok) {
        console.log("Error fetching account data:", response);
        return;
      }

      const data = await response.json();
      setCourtOptions(data);
    
  
     




      
    } catch (error) {
      console.log("Error fetching account data:", error);
    }
  };
  useEffect(() => {

   
    fetchAccountData();
  
  
   
  }, [account]);


  const handleCourtSelectionChange = (e) => {
    const selectedCourtId = e.target.value;
    setSelectedCourt(selectedCourtId);
    setSelectedDay(""); // Reset selected day when court changes
    setSelectedHour(""); // Reset selected hour when court changes
    if (selectedCourtId && selectedDay) {
      fetchReservationData(selectedCourtId, selectedDay);
    }
  };

  const handleDaySelectionChange = (e) => {
    const selectedDayValue = e.target.value;
    setSelectedDay(selectedDayValue);
    setSelectedHour(""); // Reset selected hour when day changes
    if (selectedCourt && selectedDayValue) {
      fetchReservationData(selectedCourt, selectedDayValue);
    }
  };



  const fetchReservationData = async (courtId, day) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headersWithToken = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `http://192.168.1.30:91/court/${courtId}/reservation-table?day=${day}`,
        {
          headers: headersWithToken,
        }
      );

      if (!response.ok) {
        console.log("Error fetching reservation data:", response);
        fetchAccountData();
        return;
      }
     
      const data = await response.json();
      setReservationData(data);    
      setBookingSuccess(false);
      setBookingFail(false);
      fetchAccountData();
    } catch (error) {
      console.log("Error fetching reservation data:", error);
    }
  };
  
  
  const handleShowFireworks = () => {

    setTimeout(() => {
      setShowFireworks(false);
    }, 1400); // 5000 milliseconds = 5 seconds
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };



  const [dateOptions, setDateOptions] = useState([]);
  const generateNext7Days = () => {
    const today = new Date();
    const dateArray = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const formattedDate = nextDay.toISOString().substring(0, 10);
      dateArray.push(formattedDate + "T00:00:00Z");
    }
    return dateArray;
  };

  useEffect(() => {
    const dates = generateNext7Days();
    setDateOptions(dates);
  }, []);
  





  // const reserveSlot = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const headersWithToken = {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };
  
  //     const selectedTimeSlot = reservationData.find(
  //       (timeSlot) => timeSlot.start_time === selectedHour
  //     );
  
  //     if (!selectedCourt || !selectedDay || !selectedHour || !selectedTimeSlot) {
  //       console.log("Incomplete reservation data");
  //       return;
  //     }
  
  //     const reservation = {
  //       id: selectedTimeSlot.id, // Use the ID from the fetched data
  //       court_id:  parseInt(selectedCourt),
  //       date: selectedDay,
  //       start_time: selectedTimeSlot.start_time,
  //       end_time: selectedTimeSlot.end_time,
  //       booked: true,
  //     };
  
    
  //     const response = await fetch(
  //       `http://192.168.1.30:91/reserve-slot`, 
  //       {
  //         method: "PUT",
  //         headers: headersWithToken,
  //         body: JSON.stringify(reservation),
  //       }
  //     );
  
  //     console.log(JSON.stringify(reservation));
  //     if (!response.ok) {
  //       console.log("Error updating reservation:", response);
  //       console.log(JSON.stringify(reservation));
  //       setBookingFail(true);
  //       setBookingSuccess(false);
  //       return;
  //     }
  //     console.log(JSON.stringify(reservation));
  //     setShowFireworks(true);
  //     setBookingSuccess(true);
  //     setBookingFail(false);
      
      
  //     console.log("Reservation updated successfully");
  //   } catch (error) {
  //     console.log("Error updating reservation:", error);
  //   }
    
  // };
  

  const reserveSlot = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headersWithToken = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const selectedTimeSlot = reservationData.find(
        (timeSlot) => timeSlot.start_time === selectedHour
      );
  
      if (!selectedCourt || !selectedDay || !selectedHour || !selectedTimeSlot) {
        console.log("Incomplete reservation data");
        return;
      }
  
      const reservation = {
        id: selectedTimeSlot.id, // Use the ID from the fetched data
        court_id: parseInt(selectedCourt),
        date: selectedDay,
        start_time: selectedTimeSlot.start_time,
        end_time: selectedTimeSlot.end_time,
        booked: true,
      };
  
      const response = await fetch(
        `http://192.168.1.30:91/reserve-slot`,
        {
          method: "PUT",
          headers: headersWithToken,
          body: JSON.stringify(reservation),
        }
      );
  
      if (!response.ok) {
        console.log("Error updating reservation:", response);
        
        setBookingFail(true);
        setBookingSuccess(false);
        return;
      }
  
      // Update the reservationData state to mark the selected time slot as busy
      const updatedReservationData = reservationData.map((timeSlot) =>
        timeSlot.start_time === selectedHour
          ? { ...timeSlot, booked: true }
          : timeSlot
      );
      setReservationData(updatedReservationData);
  
      setShowFireworks(true);
      setBookingSuccess(true);
      setBookingFail(false);
  
      console.log("Reservation updated successfully");
    } catch (error) {
      console.log("Error updating reservation:", error);
    }
  };
  





  const userName = localStorage.getItem("userName"); 


  const formattedUserName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : "";

  return (
 

    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
       <div className="container">





       
       <div className="wrapper-dashboard">
       {userName ? (
          <div className="personalName">Hello, {formattedUserName}!</div>
        ) : (
          <div className="personalName">
          Register and book tennis courts!{" "}
         
        </div>
        
        )}
       <div className="box-wrapper">

     

       <select
            value={selectedCourt}
            onChange={handleCourtSelectionChange}
          >
            <option value="">choose a court</option>
            {courtOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>


    </div>





       <div className="dashboard-wrapper">

       <div className="table-container">
    <table>
      <thead>
      {/* <th colSpan="4"><p>Court name: {selectedCourt}</p></th> */}
      <th colSpan="3">
  <p>Court name: {courtOptions.find(court => court.id === parseInt(selectedCourt))?.name || ""}</p>
</th>


      </thead>
      <tbody>
        <tr>
        
          <td> 
            
          <select value={selectedDay} onChange={handleDaySelectionChange}>
          <option value="">choose a day</option>
          {dateOptions.map((date, index) => (
            <option key={index} value={date}>
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              })}
            </option>
          ))}
        </select>

        <select
  value={selectedHour}
  onChange={(e) => setSelectedHour(e.target.value)}
>
  <option value="">choose time</option>
  {reservationData
    .filter((option) => option.date === selectedDay)
    .map((timeSlot) => (
      <option
        key={timeSlot.id}
        value={timeSlot.start_time}
        className={timeSlot.booked ? "busy-time" : "free-time"}
      >
        {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}{" "}
        {timeSlot.booked ? "busy" : " "}
      </option>
    ))}
</select>




</td>
              <td>
                  
              <button
  className="custom-btnBooking btn_booking"
  title="booking"
  onClick={() => {
    if (window.confirm("Are you sure you want to make a booking?")) {
      handleShowFireworks();
      reserveSlot();
      fetchAccountData();
    }
  }}
>
  <FontAwesomeIcon icon={faCheck} />
</button>

                </td>
        </tr>
     
      
      
      </tbody>
    </table>
 
   
  </div>
 
  </div>  
  <div>
  {bookingSuccess && (<><p className="booking-message">Booking done! </p>
 <p className="booking-message"> You can view the list of your bookings in the application's sidebar menu
 </p>
 
 </>
 
 
 )


  }</div>

<div>
  {bookingFail && (<><p className="booking-message">Failed to book slot </p>

 </>
 
 
 )


  }</div>




  {showFireworks && (
          <div className="fireworks">
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
          </div>
        )}
        
        </div>
        
      </div>
    
   
    </div>
  );
};
export default Dashboard;
