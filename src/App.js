import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [playerPos, setplayerPos] = useState(250);
  const [playerSpeed, setPlayerSpeed] = useState(5);
  const [tileOnePos, setTileOnePos] = useState(0);
  const [tileTwoPos, setTileTwoPos] = useState(2000);
  const [asteroidPos, setAsteroidPos] = useState(2000);
  const [asteroidTop, setAsteroidTop] = useState(150);

  const [hitEffect, setHitEffect] = useState("blue");

  const validUpKeyCodes = [38, 87];
  const validDownKeyCodes = [40, 83];

  const playerSize = 40;
  const playerOffset = 30;
  const gameAreaSize = 500;
  const asteroidSize = 50;

  const asteroidSpeed = 20;
  const bgScrollSpeed = 5;

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
  };

  const asteroidStyle = {
    left: `${asteroidPos}px`,
    width: `${asteroidSize}px`,
    height: `${asteroidSize}px`,
    top: `${asteroidTop}px`,
  };

  const tileOneStyle = {
    left: `${tileOnePos}px`,
  };

  const tileTwoStyle = {
    left: `${tileTwoPos}px`,
  };

  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      if (playerPos < 0) {
        setplayerPos(0);
      } else if (playerPos > gameAreaSize - playerSize) {
        setplayerPos(gameAreaSize - playerSize);
      }
    }, 24);

    return () => {
      clearInterval(timeId);
    };
  }, [playerPos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e.keyCode);

      if (validUpKeyCodes.includes(e.keyCode)) {
        setplayerPos((playerPos) => playerPos - playerSpeed);
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setplayerPos((playerPos) => playerPos + playerSpeed);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed);

      if (tileOnePos < -2000) {
        setTileOnePos(2000);
      }
      if (tileTwoPos < -2000) {
        setTileTwoPos(2000);
      }

      if (
        asteroidPos < playerOffset + playerSize &&
        asteroidPos + asteroidSize > playerOffset &&
        asteroidTop - asteroidSize < playerPos + playerSize &&
        asteroidTop > playerPos - asteroidSize
      ) {
        console.log("hit");
        setHitEffect("red");
      } else {
        setHitEffect("blue");
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
  }, [tileOnePos, tileTwoPos]);

  return (
    <div className="App">
      <div style={gameAreaStyle} className="game-area">
        <div className="background__container">
          <div style={tileOneStyle} className="background__tile"></div>
          <div style={tileTwoStyle} className="background__tile"></div>
        </div>
        <div style={asteroidStyle} className="asteroid"></div>
        <div style={playerStyle} className="player"></div>
      </div>
    </div>
  );
}

export default App;
