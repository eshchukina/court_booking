import React, { useEffect } from 'react';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faHouse, faCircleInfo, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import "./Sidemenu.css";
import "./Style.css";






const Sidemenu = ({ isDarkMode, setCurrentComponent, currentComponent }) => {




  
  return (
      <div className={`sidemenu ${isDarkMode ? "dark" : "light"}`}>
        <div className="container">
          <div className="wrapper-sidemenu">
            <nav className="sidemenu">
              <div
                className="sidemenu-item sidemenu-item--home"
                onClick={() => setCurrentComponent("Dashboard")}
              >
                <FontAwesomeIcon icon={faHouse} className="itemSide" />
                <a>home</a>
              </div>
           
              <FontAwesomeIcon
                icon={faArrowLeftLong}
                className={`arrow ${currentComponent !== "Info" ? "hidden" : ""}`}
              />
              <div
                className="sidemenu-item sidemenu-item--projects"
                onClick={() => setCurrentComponent("BookingList")}
              >
                <FontAwesomeIcon icon={faListCheck} className="itemSide" />
                <a>bookings</a>
              </div>
              <div
                className="sidemenu-item sidemenu-item--info"
                onClick={() => setCurrentComponent("Info")}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="itemSide itemSideLast"
                />
                <a>info</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidemenu;
  