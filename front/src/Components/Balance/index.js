import React from "react";
import Container from "react-bootstrap/Container";
import styles from "./styles.module.scss";
import balancee from "../../Img/balanca1.png";
import balancee2 from "../../Img/balanca2.png";
import balancee3 from "../../Img/balanca3.png";
import quadrado from "../../Img/formas/square.png";
import circulo from "../../Img/formas/circle.png";
import triangulo from "../../Img/formas/triangulo.png";
import pentagono from "../../Img/formas/pentagono.png";
import estrela from "../../Img/formas/star.png";

import { useContext, useEffect, useState } from "react";
import { PesoContext } from "../../Context/pesoContext";

export default function Balance({
  balance,
  balanca,
  handleDrop,
  attempt,
  setAttempt
}) {
  const { contextPeso } = useContext(PesoContext);

  const [balanceImage, setBalanceImage] = useState(() => {
    let storedImage = null;
    if (balanca === 1) {
      storedImage = localStorage.getItem("balanca1");
    } else if (balanca === 2) {
      storedImage = localStorage.getItem("balanca2");
    }
    return storedImage;
  });
  
  const [hitboxStyles, setHitboxStyles] = useState(() => {
    let storedStyles = null;
    if (balanca === 1) {
      storedStyles = JSON.parse(localStorage.getItem("hitboxStyles1"))
    } else if (balanca === 2) {
      storedStyles = JSON.parse(localStorage.getItem("hitboxStyles2"))
    }
    return storedStyles;
  });

  const pesos = contextPeso;
  const images = {
    [pesos[0]]: quadrado,
    [pesos[1]]: circulo,
    [pesos[2]]: triangulo,
    [pesos[3]]: pentagono,
    [pesos[4]]: estrela,
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnLeft = (e) => {
    e.preventDefault();
    const forma = e.dataTransfer.getData("forma");
    handleDrop(forma, balanca, "left");
  };

  const handleDropOnRight = (e) => {
    e.preventDefault();
    const forma = e.dataTransfer.getData("forma");
    handleDrop(forma, balanca, "right");
  };

  const renderFigures = (figures) => {
    let allImages = Object.entries(figures).flatMap(([key, count]) => {
      const src = images[key];
      return [...Array(count)].map((_, index) => (
        <img
          key={`${key}-${index}`}
          className={styles.forms}
          src={src}
          alt={key}
          draggable="false"
        />
      ));
    });
    const groupSizes = [4, 3, 2, 1];
    let index = 0;
    let groupedImages = [];
    groupSizes.forEach((size) => {
      let group = allImages.slice(index, index + size);
      if (group.length > 0) {
        groupedImages.push(
          <div key={`group-${size}`} className={styles.group}>
            {group}
          </div>
        );
      }
      index += size;
    });
    return <div className={styles.figureContainer}>{groupedImages}</div>;
  };

  const determineBalanceImage = () => {
    let balanceImage;
    let hitboxStyles = {};

    if (balance.right.total > balance.left.total) {
      balanceImage = balancee;
      hitboxStyles = {
        hitbox1: { top: "0.77em", left: "0.4em" },
        hitbox2: { top: "1.96em", left: "4.12em" },
      };
    } else if (balance.right.total < balance.left.total) {
      balanceImage = balancee2;
      hitboxStyles = {
        hitbox1: { top: "1.9em", left: "0.36em" },
        hitbox2: { top: "0.8em", left: "4.2em" },
      };
    } else {
      balanceImage = balancee3;
      hitboxStyles = {
        hitbox1: { top: "1.42em", left: "0.28em" },
        hitbox2: { top: "1.42em", left: "4.25em" },
      };
    }

    if(balanca == 1)
    {
      localStorage.setItem("balanca1", balanceImage);
      localStorage.setItem("hitboxStyles1", JSON.stringify(hitboxStyles));
    }

    if(balanca == 2)
    {
      localStorage.setItem("balanca2", balanceImage);
      localStorage.setItem("hitboxStyles2", JSON.stringify(hitboxStyles));
    }


    return { balanceImage, hitboxStyles };
  };

  useEffect(() => {
    if (attempt) {
      const determinedBalance = determineBalanceImage();
      setBalanceImage(determinedBalance.balanceImage);
      setHitboxStyles(determinedBalance.hitboxStyles);
      setAttempt(false);
    }
  }, [attempt]);

  return (
    <div className={styles.contorno}>
      <Container
        className={styles.hitbox1}
        style={hitboxStyles.hitbox1}
        onDragOver={handleDragOver}
        onDrop={handleDropOnLeft}
      >
        {renderFigures(balance.left.figures)}
      </Container>
      <div
        className={styles.hitbox2}
        style={hitboxStyles.hitbox2}
        onDragOver={handleDragOver}
        onDrop={handleDropOnRight}
      >
        {renderFigures(balance.right.figures)}
      </div>
      <img
        className={styles.balance}
        src={balanceImage}
        alt="Balance"
        style={{ zIndex: "1" }}
        draggable={"false"}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <p>Lado A: {balance.left.total}</p> */}
        {/* <p>Lado B: {balance.right.total}</p> */}
      </div>
    </div>
  );
}
