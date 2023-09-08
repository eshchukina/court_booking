import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faUser,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidemenu.css";
import "./Style.css";

const Sidemenu = ({ isDarkMode, setCurrentComponent}) => {
  return (
    <div className={`sidemenu ${isDarkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="wrapper-sidemenu">
          <nav className="sidemenu">
            <div
              className="sidemenu-item sidemenu-item--home"
              onClick={() => setCurrentComponent("Dashboard")}
            >
              <FontAwesomeIcon icon={faListCheck} className="itemSide" />
              <p>book a court</p>
            </div>

            <div
              className="sidemenu-item sidemenu-item--projects"
              onClick={() => setCurrentComponent("BookingList")}
            >
              <FontAwesomeIcon icon={ faUser} className="itemSide two" />
              <p>my bookings</p>
            </div>
            <div
              className="sidemenu-item sidemenu-item--info"
              onClick={() => setCurrentComponent("Info")}
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="itemSide itemSideLast"
              />
              <p className="lastSideItem">info</p>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
