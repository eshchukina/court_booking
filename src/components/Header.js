import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

import config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUserPlus,
  faEye,
  faEyeSlash,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import "./Sidemenu.css";
import "./Style.css";

import LoginButton from "./LoginButton";

import "./Header.css";

const Header = ({
  isDarkMode,
  toggleTheme,
  activeAccount,
  setActiveAccount,
  setIsLoggedIn,
  currentComponent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  // const [userName, setName] = useState(
  //   localStorage.getItem("userName") || ""
  // );
  // const [userEmail, setEmail] = useState(
  //   localStorage.getItem("userEmail") || ""
  // );



  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsModalOpen(false);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    // const fetchAccountById = async (accountId) => {
    //   try {
    //     const token = localStorage.getItem("accessToken");
    //     const headersWithToken = {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     };
    //     const response = await fetch(`${config.apiUrl}accounts/${accountId}`, {
    //       headers: headersWithToken,
    //     });
    //     if (response.ok) {
    //       const account = await response.json();
    //       setActiveAccount(account);
    //     } else {
    //       console.log("Failed to fetch account by id");
    //     }
    //   } catch (error) {
    //     console.log("Error fetching account by id:", error);
    //   }
    // };
    // const lastVisitedAccountId = localStorage.getItem("lastVisitedAccount");
    // if (lastVisitedAccountId) {
    //   fetchAccountById(lastVisitedAccountId);
    // }
  }, [setActiveAccount]);

  const handleRegistration = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch(`${config.apiUrl}registration`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log("Registration successful");

        setName("");
        setEmail("");
        setPassword("");

        setIsModalOpen(false);

        handleOpenLoginModal();
        // localStorage.setItem('userName', name);
      } else {
        console.log("Registration failed");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
    };

    try {
      // const response = await fetch(`${config.apiUrl}authorization/`,
      const response = await fetch(`${config.apiUrl}login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.accessToken) {
          const { name, email, accessToken, refreshToken, expires_in } = data;

          console.log(`${config.apiUrl}`);
          setName(name);
          setEmail(email);

          localStorage.setItem("userName", name);

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("expiresIn", expires_in.toString());
          console.log("accessToken", accessToken);

          setIsLoggedIn(true);
          // localStorage.setItem("lastVisitedAccount", activeAccount.id);
          if (activeAccount && activeAccount.id) {
            localStorage.setItem("lastVisitedAccount", activeAccount.id);
          }

          console.log(`${config.apiUrl}`);
          console.log("Login successful");
          console.log("accessToken", accessToken);

          setEmail("");
          setPassword("");
          setIsModalOpen(false);

          console.log(data);
          console.log(`${config.apiUrl}`);

          const s = localStorage.getItem("expiresIn");
          const ss = parseInt(s, 10);

          let expires_in1 = ss / 1000;
          const dateObj = new Date(expires_in1 * 1000);
          const formattedDate = dateObj.toLocaleString();
          console.log(formattedDate);
        } else {
          console.log("Access token is missing in the server response");
          console.log(`${config.apiUrl}`);
        }
      } else {
        console.log("Login failed");
        console.log(`${config.apiUrl}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    handleCloseLoginModal();
    window.location.reload();
  };

  const refreshTokenFunc = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedRefreshToken) {
      try {
        console.log("Refresh Token URL:", `${config.apiUrl}refresh`);
        console.log(JSON.stringify({ refreshToken: storedRefreshToken }));
        // const response = await fetch(`${config.apiUrl}refresh/`,
        const response = await fetch(
          `${config.apiUrl}refresh`,

          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.accessToken) {
            const { accessToken, refreshToken, expires_in } = data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("expiresIn", expires_in.toString());
            window.location.reload();
          } else {
            console.log(
              "Access token is missing in the token refresh response"
            );
          }
        } else {
          console.log("Token refresh failed");
          console.log(response);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      console.log("Refresh token is missing");
    }
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const expiresIn = localStorage.getItem("expiresIn");
    const savedUserName = localStorage.getItem("userName");
    const savedUserEmail = localStorage.getItem("userEmail");
    if (savedUserName && savedUserEmail) {
      setName(savedUserName);
      setEmail(savedUserEmail);
    }

    if (!storedAccessToken || !expiresIn) {
      refreshTokenFunc();
    } else {
      const expiresInMilliseconds = parseInt(expiresIn, 10);

      if (Date.now() >= expiresInMilliseconds) {
        refreshTokenFunc();
      } else {
        const timeLeft = expiresInMilliseconds - Date.now() - 5 * 60 * 1000;
        const timerId = setTimeout(refreshTokenFunc, timeLeft);

        return () => clearTimeout(timerId);
      }
    }
  }, []);

  // const reloadPage = () => {
  //   window.location.reload();
  // };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("modalWindow")) {
        handleCloseModal();
        handleCloseLoginModal();
      }
    };

    if (isModalOpen || isLoginModalOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen, isLoginModalOpen]);

  return (
    <div className={`header ${isDarkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="theme-wrapper">
          <ThemeToggle
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            class="custom-btnBooking btn_booking"
          />
        </div>
        {/* <div class="ball"></div> */}
        <div className="logo-wrapper">
          <div className="logo">
          {/* <img src="court-booking.png" height={150} alt="" /> */}


          </div>
        </div>
        <div className="login-wrapper">
          <LoginButton
            isDarkMode={isDarkMode}
            handleOpenLoginModal={handleOpenLoginModal}
          />{" "}
        </div>

        {isLoginModalOpen && (
          <div className="modalWindow">
            <div
              className={`modalLogin modalContent ${
                isDarkMode ? "dark" : "light"
              }`}
            >
              <h3 className={`modalText ${isDarkMode ? "dark" : "light"}`}>
                Login
              </h3>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div
                  type="button"
                  className="lockPassword"
                  onClick={handlePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </div>

                <button
                  type="submit"
                  className={`modalButtonLog ${isDarkMode ? "dark" : "light"}`}
                >
                  Login
                </button>
                <button
                  className={`buttonCLose modalButtonLog ${
                    isDarkMode ? "dark" : "light"
                  }`}
                  onClick={handleCloseLoginModal}
                >
                  Close
                </button>

                <p className={`modalText ${isDarkMode ? "dark" : "light"}`}>
                  {" "}
                  create a new account
                </p>
                <button
                  className={`custom-btnBooking btn_booking modalButtonLog ${
                    isDarkMode ? "dark" : "light"
                  }`}
                  onClick={handleOpenModal}
                >
                  Create <FontAwesomeIcon icon={faUserPlus} />
                </button>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modalWindow">
            <div
              className={`modalLogin modalContent ${
                isDarkMode ? "dark" : "light"
              }`}
            >
              <h3 className={`modalText ${isDarkMode ? "dark" : "light"}`}>
                Registration
              </h3>
              <form onSubmit={handleRegistration}>
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="passwordInputContainer">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    type="button"
                    className="lockPassword"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className={`modalButtonLog ${isDarkMode ? "dark" : "light"}`}
                >
                  Register
                </button>
                <button
                  className={`buttonCLose modalButtonLog ${
                    isDarkMode ? "dark" : "light"
                  }`}
                  onClick={handleCloseModal}
                >
                  Close
                </button>

                <p className={`modalText ${isDarkMode ? "dark" : "light"}`}>
                  {" "}
                  enter login
                </p>
                <button
                  className={`modalButtonLog ${isDarkMode ? "dark" : "light"}`}
                  onClick={handleOpenLoginModal}
                >
                  Login <FontAwesomeIcon icon={faArrowRightToBracket} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
