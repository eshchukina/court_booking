import React from "react";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginButton = ({ isDarkMode, handleOpenLoginModal }) => {
  return (
    <button
      className={`logIn ${isDarkMode ? "dark" : "light"}`}
      onClick={handleOpenLoginModal}
      title = "register"
    >
      <FontAwesomeIcon icon={faArrowRightToBracket}/>
    </button>
  );
};

export default LoginButton;
