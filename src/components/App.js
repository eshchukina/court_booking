import React, { useState, useEffect } from "react";
import Header from "./Header";

import "./Style.css";
import Dashboard from "./Dashboard";
import BookingList from "./BookingList";
import Footer from "./Footer";
import Sidemenu from "./Sidemenu";
import Info from "./Info";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("isDarkMode");
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  const [currentComponent, setCurrentComponent] = useState("dashboard");
  // const [userName, setUserName] = useState("");

  const headersWithToken = {};

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    // const storedUserName = localStorage.getItem("userName");
    // if (!storedUserName) {
    //   setCurrentComponent("Info");
    // } else {
    //   setCurrentComponent("Dashboard");

    // }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        headersWithToken={headersWithToken}
        currentComponent={currentComponent}
      />
      <Sidemenu
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent} 
        headersWithToken={headersWithToken}
      />
      <div
        className={`arrow ${
          currentComponent === "Info" ? "visible" : "hidden"
        }`}
      />

      {currentComponent === "Info" ? (
        <Info
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          headersWithToken={headersWithToken}
          setCurrentComponent={setCurrentComponent}
          currentComponent={currentComponent}
        />
      ) : currentComponent === "BookingList" ? (
        <BookingList
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          headersWithToken={headersWithToken}
        />
      ) : (
        <Dashboard
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          headersWithToken={headersWithToken}
        />
      )}

      <Footer
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        headersWithToken={headersWithToken}
      />
    </div>
  );
}

export default App;
