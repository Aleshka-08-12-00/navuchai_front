import React from "react";
import { observer } from "mobx-react-lite";

interface TimeDisplayProps {
  maxTime: number;
}
const TimeDisplay: React.FC<TimeDisplayProps> = observer(({ maxTime }) => {

    const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (maxTime === 0) {
         return 'Нет ограничения по времени';
    } else{
        return `На решение теста отводилось ${mins} : ${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <span style={{ fontSize: '18px', fontWeight: '400' }}>
      {formatTime(maxTime)}
    </span>
  );
});
export default TimeDisplay;