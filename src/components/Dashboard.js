import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";


import config from "../config";

import "./Style.css";
import "./Dashboard.css";
import WeatherChart from "./WeatherChart";

const Dashboard = ({ isDarkMode, account, headersWithToken }) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingFail, setBookingFail] = useState(false);
  const [selectedWeatherDay, setSelectedWeatherDay] = useState("");

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

  const [selectedCourt, setSelectedCourt] = useState("");
  const [courtOptions, setCourtOptions] = useState([]); // New state variable for court options

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reservationData, setReservationData] = useState([]);

  const [timeSelectionManual, setTimeSelectionManual] = useState(false);

  const storedSelectedCourt = localStorage.getItem("selectedCourt");
  const storedSelectedDay = localStorage.getItem("selectedDay");
  const storedSelectedHour = localStorage.getItem("selectedHour");
  const storedReservationData = JSON.parse(
    localStorage.getItem("reservationData")
  );
  const storedCourtOptions = JSON.parse(localStorage.getItem("courtOptions"));

  useEffect(() => {
    if (storedSelectedCourt) {
      setSelectedCourt(storedSelectedCourt);
    }
    if (storedSelectedDay) {
      setSelectedDay(storedSelectedDay);
    }
    if (storedSelectedHour) {
      setSelectedHour(storedSelectedHour);
    }
    if (storedReservationData) {
      setReservationData(storedReservationData);
    }
    if (storedCourtOptions) {
      setCourtOptions(storedCourtOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (selectedCourt && selectedDay) {
      fetchReservationData(selectedCourt, selectedDay);
    }// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourt, selectedDay]);
  

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

      const response = await fetch(`${config.apiUrl}courts`, {
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
    setSelectedHour(""); // Reset selected hour when court changes

    if (selectedCourtId && selectedDay) {
      fetchReservationData(selectedCourtId, selectedDay);
    }
    localStorage.setItem("selectedCourt", selectedCourtId);
  };

  const handleDaySelectionChange = (e) => {
    const selectedDayValue = e.target.value;
    setSelectedDay(selectedDayValue);
    setSelectedWeatherDay(selectedDayValue); 
    setSelectedHour(""); // Reset selected hour when day changes
    if (selectedCourt && selectedDayValue) {
      fetchReservationData(selectedCourt, selectedDayValue);
    }
    localStorage.setItem("selectedDay", selectedDayValue);
  };

  const fetchReservationData = async (courtId, day) => {
    
    try {
      const token = localStorage.getItem("accessToken");
      const headersWithToken = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${config.apiUrl}court/${courtId}/reservation-table?day=${day}`,
        {
          headers: headersWithToken,
        }
      );

      if (!response.ok) {
        console.log("Error fetching reservation data:", response);

        return;
      }

      const data = await response.json();
      setReservationData(data);
      setBookingSuccess(false);
      setBookingFail(false);

      localStorage.setItem("reservationData", JSON.stringify(data));
      localStorage.setItem("selectedHour", selectedHour);
      localStorage.setItem("courtOptions", JSON.stringify(data));

      fetchAccountData();
    } catch (error) {
      console.log("Error fetching reservation data:", error);
    }
  };




  const handleShowFireworks = () => {
    setTimeout(() => {
      setShowFireworks(false);
    }, 1500); // 5000 milliseconds = 5 seconds
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
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

      if (
        !selectedCourt ||
        !selectedDay ||
        !selectedHour ||
        !selectedTimeSlot
      ) {
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

      const response = await fetch(`${config.apiUrl}reserve-slot`, {
        method: "PUT",
        headers: headersWithToken,
        body: JSON.stringify(reservation),
      });

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

  const formattedUserName = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "";

  return (
    <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="wrapper-dashboard">
          {userName ? (
            <div className="personalName">Hello, {formattedUserName}!</div>
          ) : (
            <div className="personalName">
              Welcome to our Tennis Court Booking App!
            </div>
          )}
          <div className="box-wrapper">
            <select value={selectedCourt} onChange={handleCourtSelectionChange}>
              <option>court name</option>
              {courtOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <select value={selectedDay} onChange={handleDaySelectionChange}>
              <option>choose a date</option>
              {dateOptions.map((date, index) => (
                <option key={index} value={date}>
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-wrapper">
            <div className="table-container">
              <table>
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="time-buttons-column">
{reservationData
  .filter((option) => option.date === selectedDay)
  .map((timeSlot, index) => (
    <button
      key={timeSlot.id}
      onClick={() => {
        if (!timeSlot.booked) {
          setSelectedHour(timeSlot.start_time);
          setTimeSelectionManual(true);
          setSelectedButtonIndex(index); // Set the selected button index
        }
      }}
      className={`time-button ${
        timeSlot.booked ? "busy-time" : "free-time"
      } ${
        selectedButtonIndex === index ? "selected-button selected-button-color" : ""
      }`}
      disabled={timeSelectionManual && selectedHour !== timeSlot.start_time}
    >
      {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}{" "}
      {timeSlot.booked ? " " : " "}
    </button>
  ))}



                      </div>
                    </td>
                  </tr>

                  {userName ? (
                    <tr>
                      <td>
                        <button
                          className="custom-btnBooking btn_booking"
                          title="booking"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to make a booking?"
                              )
                            ) {
                              handleShowFireworks();
                              reserveSlot();
                              fetchAccountData();
                              fetchReservationData();
                            }
                            fetchAccountData();
                            fetchReservationData();
                          }}
                        >
                          {/* <FontAwesomeIcon icon={faCheck} /> */}
                          booking
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <div className="personalName">
                      {" "}
                      Register and book tennis courts!
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            {bookingSuccess && (
              <>
                <p className="booking-message">
                  Booking done! You can view the list of your bookings in the
                  application's sidebar menu{" "}
                </p>
              </>
            )}
          </div>

          <div>
            {bookingFail && (
              <>
                <p className="booking-message">Failed to book slot </p>
              </>
            )}
          </div>

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
      <WeatherChart selectedDay={selectedWeatherDay} 
       isDarkMode={isDarkMode}/>
    </div>
   </motion.div> 

  );
};
export default Dashboard;
