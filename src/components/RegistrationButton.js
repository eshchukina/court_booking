import React from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RegistrationButton = ({ isDarkMode, handleOpenModal }) => {
  return (
    <button
      className={`SignUp ${isDarkMode ? "dark" : "light"}`}
      onClick={handleOpenModal}
    >
      <FontAwesomeIcon icon={faUserPlus}/>
    </button>
  );
};

export default RegistrationButton;
