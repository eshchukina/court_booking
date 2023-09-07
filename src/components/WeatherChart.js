import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useMediaQuery } from "react-responsive"; // Импортируйте useMediaQuery

import "./WeatherChart.css";

const WeatherChart = ({isDarkMode}) => {
  const [weatherData, setWeatherData] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 750 }); // Определите, является ли экран мобильным
  const isMobileView = useMediaQuery({ maxWidth: 400 });
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.6423&longitude=41.6339&hourly=temperature_2m,apparent_temperature"
    )
      .then((response) => response.json())
      .then((data) => {
        // Извлечь данные о температуре и ощущаемой температуре
        const temperatureData = data.hourly.temperature_2m;
        const apparentTemperatureData = data.hourly.apparent_temperature;
        const timeData = data.hourly.time;

        // Создать множество для хранения уникальных дат
        const uniqueDates = new Set();

        const formattedData = timeData.map((time, index) => {
          // Разделить строку времени по "T" и выбрать только дату (первая часть)
          const date = time.split("T")[0];

          // Добавить дату в множество уникальных дат
          uniqueDates.add(date);

          return {
            date, // Использовать отформатированную дату
            temperature_2m: temperatureData[index],
            apparent_temperature: apparentTemperatureData[index],
          };
        });

        setWeatherData(formattedData);
      });
  }, []);

  let chartWidth = 800; // Значение по умолчанию для более широкого экрана
  let chartHeight = 140; // Значение по умолчанию для высоты

  if (isMobile) {
    chartWidth = 400; // Для мобильного экрана
    chartHeight = 130; // Для мобильного экрана
  } else if (isMobileView) {
    chartWidth = 200; // Для очень узкого экрана
    chartHeight = 100; // Для очень узкого экрана
  }


  return (
    <div className="container">
    

      <div className={`weather-chart ${isDarkMode ? "dark" : "light"}`}>
        <LineChart width={chartWidth} height={chartHeight} data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature_2m"
            name="Temperature (°C)"
            stroke="#b2d957"
          />
          <Line
            type="monotone"
            dataKey="apparent_temperature"
            name="Apparent temperature (°C)"
            stroke="#b3aabd"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default WeatherChart;
