import { useNavigate } from "react-router-dom";
import { apiChallenge } from "../../api/apiChallenge";
import { useEffect, useState, useRef } from "react";
import Header from "../../Components/Header";
import Timer from "../../Components/Timer";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "./styles.module.scss";

export default function Excel() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [begin, setBegin] = useState(false);

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const [timer, setTimer] = useState("00:00");
  const startTimeRef = useRef(null);

  const getStatusPeriodically = () => {
    const intervalId = setInterval(() => {
      apiChallenge
        .get(`/getstatus`)
        .then((response) => {
          if (response.data.status) {
            setStatus(response.data.status);
            setBegin(response.data.status);
          } else {
            setStatus(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 2000);
    return intervalId;
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    if (hours == hour && minutes == minute && seconds == 0) {
      // finishChallenge();
      alert("Tempo esgotado!");
      setHour(0);
      setMinute(0);
    }

    return `${hours}:${minutes}:${seconds}`;
  };


  const finishChallenge = () => {
    apiChallenge
      .get(`/finish`)
      .then((response) => {
        console.log(response);

      })
      .catch((error) => {
        console.error(error);
      });
  }

  const getTime = () => {
    apiChallenge
      .get(`/gettime`)
      .then((response) => {
        setHour(response.data.hora);
        setMinute(response.data.minuto);

      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getStatusPeriodically();
    getTime();
  }, []);

  useEffect(() => {
    let intervalId;

    if (status) {
      startTimeRef.current = Date.now();
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTimeRef.current;
        setTimer(formatTime(elapsedTime));

      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [status]);

  return (
    <div style={{ backgroundColor: "white", height: "100vh" }}>
      <Header />
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "7em",
          }}
        >
          <div className={styles.card}>
            <div className={styles.time}>{timer}</div>
          </div>
        </Container>
      </Row>
    </div>
  );
}
