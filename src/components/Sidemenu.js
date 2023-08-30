import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faHouse,
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
              <FontAwesomeIcon icon={faHouse} className="itemSide" />
              <p>home</p>
            </div>

            <div
              className="sidemenu-item sidemenu-item--projects"
              onClick={() => setCurrentComponent("BookingList")}
            >
              <FontAwesomeIcon icon={faListCheck} className="itemSide" />
              <p>bookings</p>
            </div>
            <div
              className="sidemenu-item sidemenu-item--info"
              onClick={() => setCurrentComponent("Info")}
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="itemSide itemSideLast"
              />
              <p>info</p>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
