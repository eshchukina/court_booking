import React, { useState, useEffect } from "react";
import HeatmapChart from "./HeatmapChart";
// import { motion } from "framer-motion";
// import { AnimatePresence } from 'framer-motion';

import config from "../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./Style.css";
import "./BookingList.css";

const BookingList = ({ isDarkMode, account }) => {
  const [reservations, setReservations] = useState([]);
  const [courtData, setCourtData] = useState([]);

  useEffect(() => {
    const fetchCourtData = async () => {
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
          console.log("Error fetching court data:", response);
          return;
        }
        const data = await response.json();
        setCourtData(data);
      } catch (error) {
        console.log("Error fetching court data:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headersWithToken = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`${config.apiUrl}user/reserve-list`, {
          headers: headersWithToken,
        });

        if (!response.ok) {
          console.log("Error fetching reservations:", response);
          return;
        }

        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.log("Error fetching reservations:", error);
      }
    };

    fetchCourtData();
    fetchReservations();
  }, []);

  // useEffect(() => {
  //   const fetchReservations = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       const headersWithToken = {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       };

  //       const response = await fetch("http://192.168.1.30:91/user/reserve-list", {
  //         headers: headersWithToken,
  //       });

  //       if (!response.ok) {
  //         console.log("Error fetching reservations:", response);
  //         return;
  //       }

  //       const data = await response.json();
  //       setReservations(data);

  //     } catch (error) {
  //       console.log("Error fetching reservations:", error);
  //     }
  //   };

  //   fetchReservations();
  // }, []);

  // const formatTimeRange = (startTime, endTime) => {
  //   return `${startTime} - ${endTime}`;
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const formatTimeRange = (isoTime) => {
    const date = new Date(isoTime);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleCancelReservation = async (reservationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const headersWithToken = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const reservationToDelete = reservations.find(
        (reservation) => reservation.id === reservationId
      );

      if (!reservationToDelete) {
        console.log("Reservation not found");
        return;
      }

      const cancelReservationData = {
        id: reservationToDelete.id,
        court_id: reservationToDelete.court_id,
        date: reservationToDelete.date,
        start_time: reservationToDelete.start_time,
        end_time: reservationToDelete.end_time,
        booked: true,
      };

      const response = await fetch(`${config.apiUrl}cancel-reserve`, {
        method: "PUT",
        headers: headersWithToken,
        body: JSON.stringify(cancelReservationData),
      });

      if (!response.ok) {
        console.log("Error cancelling reservation:", response);
        console.log(cancelReservationData);
        return;
      }

      const updatedReservations = reservations.filter(
        (reservation) => reservation.id !== reservationId
      );
      setReservations(updatedReservations);

      console.log("Reservation cancelled successfully");
    } catch (error) {
      console.log("Error cancelling reservation:", error);
    }
  };

  const userName = localStorage.getItem("userName");

  const formattedUserName = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "";

  return (
  //   <motion.div
  //   initial={{ opacity: 0, y: -10 }}
  //   animate={{ opacity: 1, y: 0 }}
  //   transition={{ duration: 0.5 }}
  // >
    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="wrapper-dashboard">
          <div className="dashboard-wrapper">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th colSpan="5">
                      <div>
                        {" "}
                        {userName ? (
                          <div className="personalName">
                            {formattedUserName}, нere are your booking list
                          </div>
                        ) : (
                          <div className="personalName">
                            Register and book tennis courts!{" "}
                          </div>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations !== null && reservations.length > 0 ? (
                    reservations
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((reservation) => {
                        const reservationDate = new Date(reservation.date);
                        const isPastReservation = reservationDate < new Date();
                        const court = courtData.find(
                          (court) => court.id === reservation.court_id
                        );
                        const courtName = court ? court.name : "Unknown Court";

                        return (
                          <tr
                            key={reservation.id}
                            className={isPastReservation ? "line" : ""}
                          >
                            <td>
                              <FontAwesomeIcon
                                icon={faCheck}
                                title="done"
                                className={
                                  isPastReservation ? "line" : "not-visible"
                                }
                              />
                            </td>
                            <td>{courtName}</td>
                            <td>{formatDate(reservation.date)}</td>
                            <td>
                              {formatTimeRange(reservation.start_time)} -{" "}
                              {formatTimeRange(reservation.end_time)}
                            </td>
                            <td>
                              {isPastReservation ? (
                                <p></p>
                              ) : (
                                <button
                                  title="delete"
                                  className="custom-btnBooking btn_booking"
                                  onClick={() =>
                                    handleCancelReservation(reservation.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="4">No reservations found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {userName ? (
        <HeatmapChart reservations={reservations} courtData={courtData} />
      ) : null}
    </div>
    //  </motion.div>
  );
};
export default BookingList;
