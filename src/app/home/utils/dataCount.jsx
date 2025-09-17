"use client";
import { useEffect, useState } from "react";
import "./style.css";

export default function DataCountComponent() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-11-01T20:00:00"); // 1 Noviembre 2025 - 20:00

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <div className="boxDataCountTitle">
          <div>BAILA SAO PAULO</div>
          <div>BAILA CUMBIA</div>
        </div>
        <div className="countBoxData">
          <div>
            <div>{timeLeft.days}</div>
            <div>DIAS</div>
          </div>
          <div>
            <div>{timeLeft.hours}</div>
            <div>HORAS</div>
          </div>
          <div>
            <div>{timeLeft.minutes}</div>
            <div>MINUTOS</div>
          </div>
          <div>
            <div>{timeLeft.seconds}</div>
            <div>SEGUNDOS</div>
          </div>
        </div>
      </div>
      <div>
        <img className="logoTributo" src="img/logo_tributo.png" alt="" />
      </div>
    </div>
  );
}
