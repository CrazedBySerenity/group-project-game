// Imports for react components
// useEffect - https://react.dev/reference/react/useEffect
// useState - https://react.dev/reference/react/useState
// useRef - https://react.dev/reference/react/useRef
//
import "./App.css"; // SUGGESTION: This can probably be deleted
import { useEffect, useState, useRef } from "react";

// Uuidv4 is used for creating unique ids for the shot and asteroid objects
// More info:
// https://www.npmjs.com/package/uuidv4
//
import { v4 as uuidv4 } from "uuid";

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";

// Custom Components
// Asteroid - Simple Component used to display the asteroid flying towards the player
// props: pos, top, size
//
// Shot - Simple Component used to display the laser shots the player fires
// props: pos, top, height, width
//
// Overlay - Simple component containing a UI overlay that displays different visuals depending on the gameOver and gameStarted variables
// props: gameOver, score, gameStarted
//
// Leaderboard - Component that displays and updates a leaderboard containing the top 5 highest scores available in db.json
// props:  gameSize, currentScore, gameOver
//
import Asteroid from "./Asteroid";
import Shot from "./Shot";
import Overlay from "./Overlay";
import Leaderboard from "./components/Leaderboard";

// Custom Hooks
// useWindowDimensions - Simple hook that returns an object with a width and height property corresponding to the window size in pixels
// return: {width: Current screen width, height: Current screen height}
//
import useWindowDimensions from "./UseWindowDimensions";
//

function App() {

  // VARIABLE DECLARATION GOES HERE:

  let windowSize = useWindowDimensions();

  const gameAreaSize = {
    width: windowSize.width < 2000 ? windowSize.width : 2000,
    height: windowSize.height < 500 ? windowSize.height : 500,
  };

  const [playerPos, setplayerPos] = useState(250);
  const [tileOnePos, setTileOnePos] = useState(0);
  const [tileTwoPos, setTileTwoPos] = useState(gameAreaSize.width);
  const [currentAsteroids, setCurrentAsteroids] = useState([]);
  const [asteroidTimer, setAsteroidTimer] = useState(0);
  const [currentShots, setCurrentShots] = useState([]);
  const [shotCooldown, setShotCooldown] = useState(0);

  const [downIsPressed, setDownIsPressed] = useState(false);
  const [upIsPressed, setUpIsPressed] = useState(false);
  const [spaceIsPressed, setSpaceIsPressed] = useState(false);

  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setgameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const lastCall = useRef(0);

  const asteroidSpawnTimer = {
    min: 1,
    max: 3,
  };

  const maxAsteroids = 10;
  const maxShots = 20;
  const baseAsteroidScore = 150;

  const validUpKeyCodes = [38, 87];
  const validDownKeyCodes = [40, 83];
  const validRestartKeyCodes = [13, 82];

  const playerSize = 64;
  const playerOffset = 30;
  const asteroidSize = 50;

  const playerSpeed = 30;
  const asteroidSpeed = 10;
  const bgScrollSpeed = 50;
  const shotSpeed = 50;
  const shotCooldownTime = 100;

  // Style variables to be able to change styles dynamically
  //
  const gameAreaStyle = {
    backgroundColor: "black",
    width: `${gameAreaSize.width}px`,
    height: `${gameAreaSize.height}px`,
  };

  const playerStyle = {
    position: `absolute`,

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

  const backgroundContainerStyle = {
    width: `${gameAreaSize.width}px`,
    height: `${gameAreaSize.height}px`,
  };


  // AsteroidRenderer - Returns the Asteroids so they can be rendered
  //
  // Basic flow:
  // --> Invoke renderAsteroids (returns Asteroid components)
  // --> receive and return Asteroid components again
  // --> Asteroid components are rendered
  //
  const AsteroidRenderer = () => {
    return <>{renderAsteroids()}</>;
  };

  // renderAsteroids - Maps through the currentAsteroids array and returns an Asteroid component for each item it contains
  //
  // Basic flow:
  // --> Create a new array (visibleAsteroids)
  // --> Loop through the currentAsteroids array
  // --> For every item (asteroid) it contains
  //    --> Create a new Asteroid component
  //    --> Assign the new component a new
  //      --> key based on the current items id property
  //      --> pos based on the current items pos property
  //      --> top based on the current items top property
  //      --> size based on the asteroidSize variable
  //      --> Add this new component to the visibleAsteroids Array
  // --> return the visibleAsteroids array (now containing zero or more Asteroid components with different values)
  //
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

  // ShotRenderer - Copy of the AsteroidRenderer function except for shots
  const ShotRenderer = () => {
    return <>{renderShots()}</>;
  };

  // renderShots - Copy of the renderAsteroids function except for shots
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


  // playerShoot - Adds a new item to the currentShots array with the values needed for a new shot to be rendered
  //
  // Basic flow:
  // --> Checks if the player has pressed the button to shoot (spaceIsPressed) and the shooting cooldown is over (shotCooldown)
  // --> Also checks to make sure the player has not already fired too many shots, if either check fails do nothing
  // --> Creates a new variable (newShotTop) with the correct spawn-position for the new shot based on player position and size
  // --> Adds a new object to the setCurrentShotsn array
  // --> Assigns the new object the properties:
  //    --> pos based on where to spawn the shot horizontally
  //    --> top based on newShotTop (see above)
  //    --> id based on a new unique id from uuidv4
  //    --> width, height based on how big the shot should be
  //
  function playerShoot() {
    if (spaceIsPressed && shotCooldown <= 0 && currentShots.length < maxShots) {
      let newShotTop = playerPos + playerSize * 0.5 - 5;
      setShotCooldown(shotCooldownTime);
      console.log("shot fired");
      setCurrentShots([
        ...currentShots,
        { pos: 70, top: newShotTop, id: uuidv4(), width: 40, height: 10 }, //SUGGESTION: Replace pos with playerSize + PlayerOffset
      ]);
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
          Math.random() * (gameAreaSize.height - asteroidSize)
        );
        if (newAsteroidTop < asteroidSize) {
          newAsteroidTop = asteroidSize;
        }

        setCurrentAsteroids([
          ...currentAsteroids,
          {
            pos: gameAreaSize.width,
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

    setCurrentScore((currentScore) => currentScore + baseAsteroidScore);
  }

  function removeShot(id) {
    setCurrentShots(currentShots.filter((shot) => shot.id !== id));
  }

  function LoseGame() {
    console.log("Game Over");

    setCurrentAsteroids([]);
    setCurrentShots([]);
    setgameOver(true);
    setGameStarted(false);
  }
  //COLLECTING PLAYER INPUT
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e.keyCode);

      if (validUpKeyCodes.includes(e.keyCode)) {
        setUpIsPressed(true);
        if (!gameOver && !gameStarted) {
          setGameStarted(true);
        }
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setDownIsPressed(true);
        if (!gameOver && !gameStarted) {
          setGameStarted(true);
        }
      }
      if (e.keyCode === 32) {
        setSpaceIsPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      console.log(e.keyCode);

      if (gameOver && validRestartKeyCodes.includes(e.keyCode)) {
        setgameOver(false);
        setCurrentScore(0);
        //Do more stuff to restart the game
      }

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

  //MOVING PLAYER
  useEffect(() => {
    if (gameOver) return;
    if (!gameStarted) return;
    let interval;
    interval = d3Interval(() => {
      if (!(playerPos < 0)) {
        if (!downIsPressed && upIsPressed) {
          setplayerPos((playerPos) => playerPos - playerSpeed);
        }
      }

      if (!(playerPos > gameAreaSize.height - playerSize)) {
        if (downIsPressed && !upIsPressed) {
          setplayerPos((playerPos) => playerPos + playerSpeed);
        }
      }

      playerShoot();
    }, 20);

    return () => {
      interval.stop();
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
    let interval;
    interval = d3Interval(() => {
      if (gameOver) return;
      if (!gameStarted) return;
      let now = d3Now();
      let deltaTime = (now - lastCall.current) / 1000;
      lastCall.current = now;
      if (deltaTime > 200) deltaTime = 0.01;

      addAsteroid();
      setShotCooldown((shotCooldown) => shotCooldown - 1 * deltaTime * 1000);
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed * deltaTime);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed * deltaTime);

      if (tileOnePos < -gameAreaSize.width) {
        setTileOnePos(gameAreaSize.width);
      }
      if (tileTwoPos < -gameAreaSize.width) {
        setTileTwoPos(gameAreaSize.width);
      }

      let hit = false;
      if (currentAsteroids.length >= 1) {
        currentAsteroids.map((asteroid) => {
          asteroid.pos -= asteroidSpeed;

          if (asteroid.pos < -200) {
            LoseGame();
            //removeAsteroid(asteroid.id);
          }

          if (
            asteroid.pos < playerOffset + playerSize &&
            asteroid.pos + asteroidSize > playerOffset &&
            asteroid.top - asteroidSize < playerPos &&
            asteroid.top > playerPos + playerSize
          ) {
            LoseGame();
          }
          if (currentShots.length >= 1) {
            currentShots.map((shot) => {
              shot.pos += shotSpeed;

              if (shot.pos > gameAreaSize.width) {
                removeShot(shot.id);
              }

              if (
                asteroid.pos < shot.pos + shot.width &&
                asteroid.pos + asteroidSize > shot.pos &&
                asteroid.top <= shot.top + shot.height * 2 &&
                asteroid.top + asteroidSize > shot.top - shot.height
              ) {
                console.log("Hit asteroid");
                removeAsteroid(asteroid.id);
                removeShot(shot.id);
              }

              return shot;
            });
          }

          return asteroid;
        });
      } else if (currentShots.length >= 1) {
        currentShots.map((shot) => {
          shot.pos += shotSpeed;

          if (shot.pos > gameAreaSize.width) {
            removeShot(shot.id);
          }

          return shot;
        });
      }
    }, 5);

    return () => {
      interval.stop();
    };
  }, [
    tileOnePos,
    tileTwoPos,
    playerPos,
    currentAsteroids,
    currentShots,
  ]);

  return (
    <div className="App">
      <div style={gameAreaStyle} className="game-area">
        <div style={backgroundContainerStyle} className="background__container">
          <div style={tileOneStyle} className="background__tile"></div>
          <div style={tileTwoStyle} className="background__tile"></div>
        </div>
        <AsteroidRenderer />
        <ShotRenderer />

        <Overlay
          gameOver={gameOver}
          score={currentScore}
          gameStarted={gameStarted}
          gameAreaWidth={gameAreaSize.width}
          gameAreaHeight={gameAreaSize.height}
        ></Overlay>
        <div style={playerStyle} className="player"></div>
      </div>
      <Leaderboard gameSize={gameAreaSize} currentScore={currentScore} gameOver={gameOver}/>
    </div>
  );
}

export default App;
