import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Asteroid from "./Asteroid";
import Shot from "./Shot";

function App() {
  const [playerPos, setplayerPos] = useState(250);
  const [playerSpeed, setPlayerSpeed] = useState(30);
  const [tileOnePos, setTileOnePos] = useState(0);
  const [tileTwoPos, setTileTwoPos] = useState(2000);
  const [asteroidPos, setAsteroidPos] = useState(2000);
  const [asteroidTop, setAsteroidTop] = useState(150);
  const [currentAsteroids, setCurrentAsteroids] = useState([]);
  const [asteroidTimer, setAsteroidTimer] = useState(0);
  const [currentShots, setCurrentShots] = useState([]);
  const [shotCooldown, setShotCooldown] = useState(0);

  const [downIsPressed, setDownIsPressed] = useState(false);
  const [upIsPressed, setUpIsPressed] = useState(false);
  const [spaceIsPressed, setSpaceIsPressed] = useState(false);

  const [hitEffect, setHitEffect] = useState("blue");

  const asteroidSpawnTimer = {
    min: 1,
    max: 3,
  };

  const maxAsteroids = 10;
  const maxShots = 10;

  const validUpKeyCodes = [38, 87];
  const validDownKeyCodes = [40, 83];

  const playerSize = 40;
  const playerOffset = 30;
  const gameAreaSize = 500;
  const asteroidSize = 50;

  const asteroidSpeed = 20;
  const bgScrollSpeed = 5;
  const shotSpeed = 25;
  const shotCooldownTime = 10;

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

  const tileOneStyle = {
    left: `${tileOnePos}px`,
  };

  const tileTwoStyle = {
    left: `${tileTwoPos}px`,
  };

  const AsteroidRenderer = () => {
    return <>{renderAsteroids()}</>;
  };
  const ShotRenderer = () => {
    return <>{renderShots()}</>;
  };

  function renderAsteroids() {
    let visibleAsteroids = currentAsteroids.map((asteroid) => (
      <Asteroid
        key={asteroid.id}
        pos={asteroid.pos}
        top={asteroid.top}
        size={asteroidSize}
      />
    ));
    return visibleAsteroids;
  }

  function renderShots() {
    let visibleShots = currentShots.map((shot) => (
      <Shot
        key={shot.id}
        pos={shot.pos}
        top={shot.top}
        width={shot.width}
        height={shot.height}
      />
    ));
    return visibleShots;
  }

  function playerShoot() {
    if (spaceIsPressed && shotCooldown <= 0) {
      let newShotTop = playerPos + playerSize / 2 + 5;

      if (currentShots.length < maxShots) {
        setShotCooldown(shotCooldownTime);
        console.log("shot fired");
        setCurrentShots([
          ...currentShots,
          { pos: 70, top: newShotTop, id: uuidv4(), width: 40, height: 10 },
        ]);
      }
    }
  }

  function addAsteroid() {
    let now = new Date().getTime();
    //Check timer and set timer
    if (asteroidTimer < now) {
      let newTimer =
        now +
        (Math.random(asteroidSpawnTimer.max - asteroidSpawnTimer.min) +
          asteroidSpawnTimer.min) *
          1000;
      setAsteroidTimer(newTimer);
      if (currentAsteroids.length < maxAsteroids) {
        let newAsteroidTop = Math.floor(
          Math.random() * (gameAreaSize - asteroidSize)
        );
        if (newAsteroidTop < asteroidSize) {
          newAsteroidTop = asteroidSize;
        }

        setCurrentAsteroids([
          ...currentAsteroids,
          {
            pos: 2000,
            top: newAsteroidTop,
            id: uuidv4(),
          },
        ]);
      }
    }
  }

  function removeAsteroid(id) {
    setCurrentAsteroids(
      currentAsteroids.filter((asteroid) => asteroid.id !== id)
    );
  }
  function removeShot(id) {
    setCurrentShots(currentShots.filter((shot) => shot.id !== id));
  }

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

  //PLAYER INPUT
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

      playerShoot();
    }, 24);

    return () => {
      clearInterval(timeId);
    };
  }, [
    downIsPressed,
    upIsPressed,
    playerPos,
    playerSpeed,
    spaceIsPressed,
    currentShots,
  ]);

  //MOVEMENT AND COLLISION
  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      addAsteroid();
      setShotCooldown((shotCooldown) => shotCooldown - 1);
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed);

      if (tileOnePos < -2000) {
        setTileOnePos(2000);
      }
      if (tileTwoPos < -2000) {
        setTileTwoPos(2000);
      }

      let hit = false;

      currentAsteroids.map(function (asteroid) {
        asteroid.pos -= asteroidSpeed;

        if (asteroid.pos < -200) {
          removeAsteroid(asteroid.id);
        }

        if (
          asteroid.pos < playerOffset + playerSize &&
          asteroid.pos + asteroidSize > playerOffset &&
          asteroid.top - asteroidSize < playerPos &&
          asteroid.top > playerPos + playerSize
        ) {
          hit = true;
          console.log("hit");
        }

        currentShots.map(function (shot) {
          shot.pos += shotSpeed;
  
          if (shot.pos > 2000) {
            removeShot(shot.id);
          }

          if (
            asteroid.pos < shot.pos + shot.width &&
            asteroid.pos + asteroidSize > shot.pos &&
            asteroid.top <= shot.top + shot.height &&
            asteroid.top + asteroidSize > shot.top
          ) {
            console.log("Hit asteroid");
            removeAsteroid(asteroid.id);
            removeShot(shot.id);
          }

          return(shot);
          
        });

        return asteroid;
      });

      if (hit) {
        setHitEffect("red");
      } else {
        setHitEffect("blue");
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
    currentAsteroids,
    currentShots,
  ]);

  return (
    <div className="App">
      <div style={gameAreaStyle} className="game-area">
        <div className="background__container">
          <div style={tileOneStyle} className="background__tile"></div>
          <div style={tileTwoStyle} className="background__tile"></div>
        </div>
        <AsteroidRenderer />
        <ShotRenderer />
        <div style={playerStyle} className="player"></div>
      </div>
    </div>
  );
}

export default App;
