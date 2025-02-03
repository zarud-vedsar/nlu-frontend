import { useEffect, useState } from "react";

const ReverseTimer = ({ minute,handleSubmit }) => {
  const [time, setTime] = useState(minute * 60);

  useEffect(() => {
    if (time <= 0) {
        handleSubmit()
      console.log("Time's up!");
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="d-flex  align-items-center">
        <h3 className="mr-2 text-danger">Timer</h3>
    <h1 className="text-danger"> {formatTime(time)}</h1>
  </div>
  );
};

export default ReverseTimer;
