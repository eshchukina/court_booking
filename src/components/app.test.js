// app.test.js
import React from "react";
import { shallow } from "enzyme"; // Импорт необходимых библиотек
import App from "./App"; // Импорт компонента для тестирования
import "./setupTests"; // Импорт файла настройки enzyme перед запуском тестов

describe("App Component", () => {
  it("renders without crashing", () => {
    shallow(<App />); // Создание поверхностного (shallow) рендера компонента
  });

  // Добавьте другие тесты по необходимости
});
