import React from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../../store/store";

interface TimeDisplayProps {
  maxTime: number; // Пороговое значение в секундах
}

const TimeDisplay: React.FC<TimeDisplayProps> = observer(({ maxTime }) => {
  const { test_time } = store.selectedUser!; // Получаем тестовое время
  // Преобразуем строку времени в минуты и секунды
  const timeParts = test_time.split(':'); // разделяем строку по двоеточию
  const minutes = parseInt(timeParts[0]);
  const seconds = parseInt(timeParts[1]);

  const timeInSeconds = minutes * 60 + seconds;

  if (isNaN(timeInSeconds)) {
    return <span>Неверное значение времени</span>;
  }

  // Форматируем фактическое время
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Вычисляем максимальное время в формате MM:SS
  const maxMinutes = Math.floor(maxTime / 60);
  const maxSeconds = maxTime % 60;
  const formattedMaxTime = `${String(maxMinutes).padStart(2, '0')}:${String(maxSeconds).padStart(2, '0')}`;

  return (
    <span style={{ color: timeInSeconds > maxTime ? "red" : "#1677ff", fontSize: '18px',  fontWeight: '400' }}>
      {formattedTime} / {formattedMaxTime}
    </span>
  );
});

export default TimeDisplay;
