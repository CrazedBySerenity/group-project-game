import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [playerPos, setplayerPos] = useState(250);
  const [playerSpeed, setPlayerSpeed] = useState(30);
  const [tileOnePos, setTileOnePos] = useState(0);
  const [tileTwoPos, setTileTwoPos] = useState(2000);
  const [asteroidPos, setAsteroidPos] = useState(2000);
  const [asteroidTop, setAsteroidTop] = useState(150);
  const [shotPos, setShotPos] = useState(-110);
  const [shotActive, setShotActive] = useState(false);
  const [shotTop, setShotTop] = useState(0);
  const [shotDisplay, setShotDisplay] = useState("none");
  const [score, setScore] = useState(0);

  const [downIsPressed, setDownIsPressed] = useState(false);
  const [upIsPressed, setUpIsPressed] = useState(false);
  const [spaceIsPressed, setSpaceIsPressed] = useState(false);

  const [hitEffect, setHitEffect] = useState("blue");

  const validUpKeyCodes = [38, 87];
  const validDownKeyCodes = [40, 83];

  const playerSize = 40;
  const playerOffset = 30;
  const gameAreaSize = 500;
  const asteroidSize = 50;
  const shotHeight = 10;

  const asteroidSpeed = 20;
  const bgScrollSpeed = 5;
  const shotSpeed = 25;

  const gameAreaStyle = {
    backgroundColor: "black",
    width: `${gameAreaSize}px`,
    height: `${gameAreaSize}px`,
  };

  const playerStyle = {
    position: `absolute`,
    backgroundColor: `${hitEffect}`,
    width: `${playerSize}px`,
    height: `${playerSize}px`,
    top: `${playerPos}px`,
    left: `${playerOffset}px`,
    transition: `top, ${playerSpeed / 200}s`,
  };

  const asteroidStyle = {
    left: `${asteroidPos}px`,
    width: `${asteroidSize}px`,
    height: `${asteroidSize}px`,
    top: `${asteroidTop}px`,
  };
  const shotStyle = {
    left: `${shotPos}px`,
    top: `${shotTop}px`,
    backgroundColor: `red`,
    width: "40px",
    height: `${shotHeight}px`,
    position: "absolute",
    transition: `top, ${playerSpeed / 200}s`,
    display: `${shotDisplay}`,
  };

  const tileOneStyle = {
    left: `${tileOnePos}px`,
  };

  const tileTwoStyle = {
    left: `${tileTwoPos}px`,
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e.keyCode);

      if (validUpKeyCodes.includes(e.keyCode)) {
        setUpIsPressed(true);
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setDownIsPressed(true);
      }
      if (e.keyCode === 32) {
        setSpaceIsPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      console.log(e.keyCode);

      if (validUpKeyCodes.includes(e.keyCode)) {
        setUpIsPressed(false);
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setDownIsPressed(false);
      }
      if (e.keyCode === 32) {
        setSpaceIsPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      if (!(playerPos < 0)) {
        if (!downIsPressed && upIsPressed) {
          setplayerPos((playerPos) => playerPos - playerSpeed);
        }
      }

      if (!(playerPos > gameAreaSize - playerSize)) {
        if (downIsPressed && !upIsPressed) {
          setplayerPos((playerPos) => playerPos + playerSpeed);
        }
      }
    }, 24);

    return () => {
      clearInterval(timeId);
    };
  }, [downIsPressed, upIsPressed, playerPos, playerSpeed]);

  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed);

      if (spaceIsPressed && !shotActive) {
        setShotDisplay("block");

        setShotPos(70);
        setShotTop(playerPos + playerSize / 2 - 5);
        setShotActive(true);
      }

      if (shotActive) {
        console.log("Shot fired");
        setShotPos((shotPos) => shotPos + shotSpeed);
        if (shotPos >= 2000) {
          setShotDisplay("none");
          setShotPos(-110);
          setShotActive(false);
        }
        if (
          shotPos < asteroidPos + asteroidSize &&
          shotPos + shotHeight > asteroidPos &&
          asteroidTop - asteroidSize < shotPos + shotHeight &&
          asteroidTop > shotPos - asteroidSize
        ) {
          console.log("hit");
        }
      }

      if (tileOnePos < -2000) {
        setTileOnePos(2000);
      }
      if (tileTwoPos < -2000) {
        setTileTwoPos(2000);
      }

      if (
        shotTop <= asteroidTop + asteroidSize &&
        shotTop + shotHeight >= asteroidTop &&
        shotPos <= asteroidPos + asteroidSize &&
        shotPos + 40 >= asteroidPos
      ) {
        console.log("hit");
        setShotDisplay("none");
        setShotPos(-110);
        setShotActive(false);
        setAsteroidPos(2000);
        setAsteroidTop(
          Math.floor(Math.random() * (gameAreaSize - asteroidSize))
        );
        setScore((score) => score + 1);
      }

      setAsteroidPos((asteroidPos) => asteroidPos - asteroidSpeed);

      if (asteroidPos < -2000) {
        setAsteroidPos(2000);
        setAsteroidTop(
          Math.floor(Math.random() * (gameAreaSize - asteroidSize))
        );
        if (asteroidTop < asteroidSize) {
          setAsteroidTop(asteroidSize);
        }
      }
    }, 24);

    return () => {
      clearInterval(timeId);
    };
  }, [
    tileOnePos,
    tileTwoPos,
    asteroidPos,
    asteroidTop,
    playerPos,
    spaceIsPressed,

    shotActive,
    shotPos,
    shotTop,
  ]);

  return (
    <div className="App">
      <div style={gameAreaStyle} className="game-area">
        <div className="background__container">
          <div style={tileOneStyle} className="background__tile"></div>
          <div style={tileTwoStyle} className="background__tile"></div>
        </div>
        <div style={asteroidStyle} className="asteroid"></div>
        <div style={playerStyle} className="player"></div>
        <div style={shotStyle} />
      </div>
      <p style={{ color: "white" }}>{`Score: ${score}`}</p>
    </div>
  );
}

export default App;
