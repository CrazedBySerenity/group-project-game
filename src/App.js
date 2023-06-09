// Imports for react components
// useEffect - https://react.dev/reference/react/useEffect
// useState - https://react.dev/reference/react/useState
// useRef - https://react.dev/reference/react/useRef
//
import "./App.css"; // SUGGESTION: This can probably be deleted
import { useEffect, useState, useRef } from "react";

// Uuidv4 is used for creating unique ids for the shot and asteroid objects
// The ids created by the uuidv4 function are strings and look roughly like 'b1c4a89e-4905-5e3c-b57f-dc92627d011e'
// More info:
// https://www.npmjs.com/package/uuid
//
import { v4 as uuidv4 } from "uuid";

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";
import { authenticate } from "./helpers";

// Custom Components
// Asteroid - Simple Component used to display the asteroid flying towards the player
// props: pos, top, size
//
// Shot - Simple Component used to display the laser shots the player fires
// props: pos, top, height, width
//
// Overlay - Simple component containing a UI overlay that displays different visuals depending on the gameOver and gameStarted variables
// props: gameOver, score, gameStarted, userRegister, userLogin
//
// Leaderboard - Component that displays and updates a leaderboard containing the top 5 highest scores available in db.json
// props:  gameSize, currentScore, gameOver
//
import Asteroid from "./components/Asteroid";
import Shot from "./components/Shot";
import Overlay from "./components/Overlay";
import BottomBar from "./components/BottomBar";
import Leaderboard from "./components/Leaderboard";

// Custom Hooks
// useWindowDimensions - Simple hook that returns an object with a width and height property corresponding to the window size in pixels
// return: {width: Current screen width, height: Current screen height}
//
import useWindowDimensions from "./components/UseWindowDimensions";

function App() {
  // OBJECT CONTAINING CURRENT SIZE OF THE WINDOW [OBJECT]
  let windowSize = useWindowDimensions();

  // OBJECT CONTAINING THE SIZE FOR THE GAMEAREA BASED ON WINDOW SIZE
  const gameAreaSize = {
    width: windowSize.width < 2000 ? windowSize.width : 2000,
    height: windowSize.height < 500 ? windowSize.height : 500,
  };

  // THE PLAYERS CURRENT POSITION (VERTICAL) [NUMBER]
  const [playerPos, setplayerPos] = useState(250);
  // THE POSITION OF THE FIRST BACKGROUND TILE (FIRST AND SECOND HAS NO REAL IMPLICATION SINCE THEY SWAP AROUND) [NUMBER]
  const [tileOnePos, setTileOnePos] = useState(0);
  // THE POSTION OF THE SECOND BACKGROUND TILE (FIRST AND SECOND HAS NO REAL IMPLICATION SINCE THEY SWAP AROUND) [NUMBER]
  const [tileTwoPos, setTileTwoPos] = useState(gameAreaSize.width);

  // THE ARRAY CONTAINING THE CURRENT ASTEROIDS ON THE FIELD [ARRAY OF OBJECTS]
  // ASTEROIDS ARE REPRESENTED WITH OBJECTS AND IT'S RELEVANT VALUES WITH PROPERTIES
  //
  // STRUCTURE EXAMPLE: [{pos, top, id}, {pos, top, id}, {pos, top, id}, {pos, top, id}]
  const [currentAsteroids, setCurrentAsteroids] = useState([]);
  // THE TIME WHEN THE NEXT ASTEROID SHOULD BE SPAWNED IN, REPRESENTED BY A NUMBER IN MILLISECONDS SLIGHTLY LARGER THAN DATE.NOW [NUMBER]
  // SUGGESTION: ELABORATE ON THIS EXPLANATION
  const [asteroidTimer, setAsteroidTimer] = useState(0);
  // THE ARRAY CONTAINING THE CURRENT SHOTS ON THE FIELD [ARRAY OF OBJECTS]
  // SHOTS ARE REPRESENTED WITH OBJECTS AND IT'S RELEVANT VALUES WITH PROPERTIES
  //
  // STRUCTURE EXAMPLE: [{pos, top, id, width, height}, {pos, top, id, width, height}, {pos, top, id, width, height}]
  const [currentShots, setCurrentShots] = useState([]);

  // THE TIME WHEN THE NEXT SHOT SHOULD BE SPAWNED IN, REPRESENTED BY A NUMBER IN MILLISECONDS SLIGHTLY LARGER THAN DATE.NOW [NUMBER]
  // REPLACES THE OLD SHOTCOOLDOWN
  // SUGGESTION: ELABORATE ON THIS EXPLANATION
  const [shotTimer, setShotTimer] = useState(0);

  // A BOOLEAN OF WHETHER DOWN IS CURRENTLY BEING PRESSED OR NOT [BOOLEAN]
  const [downIsPressed, setDownIsPressed] = useState(false);
  // A BOOLEAN OF WHETHER UP IS CURRENTLY BEING PRESSED OR NOT [BOOLEAN]
  const [upIsPressed, setUpIsPressed] = useState(false);
  // A BOOLEAN OF WHETHER SPACE IS CURRENTLY BEING PRESSED OR NOT [BOOLEAN]
  // SUGGESTION: SWAP TO shootIsPressed AND ADD THE ABILITY TO HAVE MULTIPLE VALID KEYS FOR SHOOTING
  const [spaceIsPressed, setSpaceIsPressed] = useState(false);

  // THE PLAYERS CURRENT SCORE [NUMBER]
  const [currentScore, setCurrentScore] = useState(0);
  // A BOOLEAN OF WHETHER THE GAME IS OVER OR NOT [BOOLEAN]
  const [gameOver, setgameOver] = useState(false);
  // A BOOLEAN OF WHETHER THE GAME HAS STARTED OR NOT [BOOLEAN]
  const [gameStarted, setGameStarted] = useState(false);
  const [userRegister, setUserRegister] = useState(false);
  const [userLogin, setUserLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  // SUGGESTION: REMOVE OR ELABORATE ON THIS
  const lastCall = useRef(0);

  // THE MINIMUM AND MAXIMUM TIME TO WAIT BEFORE SPAWNING AN ASTEROID, IN SECONDS [OBJECT]
  // LATER ASSIGNED RANDOMLY BETWEEN THESE NUMBERS
  const asteroidSpawnTimer = {
    min: 1,
    max: 3,
  };
  // HOW FAR THE ASTEROID SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
  const [asteroidSpeed, setAsteroidSpeed] = useState(10);
  // HOW MANY ASTEROIDS ARE ALLOWED TO BE ON SCREEN AT THE SAME TIME [NUMBER]
  const maxAsteroids = 10;
  // HOW MUCH SCORE THE PLAYER GAINS FOR DESTROYING AN ASTEROID [NUMBER]
  const baseAsteroidScore = 150;
  // HOW BIG THE ASTEROID IS, IN PIXELS (LATER SQUARED) [NUMBER]
  const asteroidSize = 50;

  // THE TIME TO WAIT BEFORE BEING ABLE TO FIRE ANOTHER SHOT, IN SECONDS [NUMBER]
  const shotSpawnTimer = 0.1;
  // HOW MANY SHOTS THE PLAYER CAN HAVE ON-SCREEN AT THE SAME TIME [NUMBER]
  const maxShots = 10;
  // HOW FAR THE SHOT SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
  const shotSpeed = 50;

  // VALID KEY-PRESSES TO MOVE THE PLAYER UP, IN KEYCODE [ARRAY OF NUMBERS]
  // 38 = ARROW UP
  // 87 = W
  const validUpKeyCodes = [38, 87];
  // VALID KEY-PRESSES TO MOVE THE PLAYER DOWN, IN KEYCODE [ARRAY OF NUMBERS]
  // 40 = ARROW DOWN
  // 83 = S
  const validDownKeyCodes = [40, 83];
  // VALID KEY-PRESSES TO RESTART THE GAME, IN KEYCODE [ARRAY OF NUMBERS]
  // 13 = ENTER
  // 82 = R
  const validRestartKeyCodes = [13, 82];
  // MORE INFO ON KEYCODES: https://www.toptal.com/developers/keycode/table

  // THE SIZE OF THE PLAYER, IN PIXELS (LATER SQUARED) [NUMBER]
  const playerSize = 64;
  // THE DISTANCE THE PLAYER IS PLACED FROM THE LEFT SIDE OF THE SCREEN, IN PIXELS [NUMBER]
  const playerOffset = 30;
  // HOW FAR THE PLAYER CAN TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
  // NOTE THAT THE PLAYER WILL TRAVEL VERTICALLY INSTEAD OF HORIZONTALLY [NUMBER]
  const playerSpeed = 30;

  // HOW FAR THE BACKGROUND SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
  const bgScrollSpeed = 5;

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
  // --> Checks if the player has pressed the button to shoot (spaceIsPressed) and the shooting timer is over (shotTimer)
  // --> Also checks to make sure the player has not already fired too many shots, if either check fails do nothing
  // --> Resets the shooting timer (setShotTimer)
  // --> Creates a new variable (newShotTop) with the correct spawn-position for the new shot based on player position and size
  // --> Adds a new object to the setCurrentShots array and assigns it the properties:
  //    --> pos based on where to spawn the shot horizontally
  //    --> top based on newShotTop (see above)
  //    --> id based on a new unique id from uuidv4
  //    --> width, height based on how big the shot should be
  //
  function playerShoot() {
    let now = d3Now();

    if (spaceIsPressed && currentShots.length < maxShots && shotTimer < now) {
      let newTimer = now + shotSpawnTimer * 1000;
      setShotTimer(newTimer);

      let newShotTop = playerPos + playerSize * 0.5 - 5;
      console.log("shot fired");
      setCurrentShots([
        ...currentShots,
        { pos: 70, top: newShotTop, id: uuidv4(), width: 40, height: 10 }, //SUGGESTION: Replace pos with playerOffset + playerSize   || Correct change would be to set pos to playerSize + shot.width
      ]);
    }
  }

  // addAsteroid - Similar to the playerShoot function except it also handles a timer,
  // The function adds a new item to the currentAsteroids array if the previous timer is over,
  // It then gives it a random top-position within the bounds of the game-area
  //
  // Basic flow:
  // --> Grabs the current time in milliseconds
  // --> Checks if the previous timer has expired (asteroidTimer), if not do nothing
  // --> Sets the new timer by adding a random amount of milliseconds between an interval (max and min within asteroidSpawntimer)
  // --> Checks if the limit for how many asteroids are allowed simultaneously is already reached, if so do nothing
  // --> Randomises a top position within the height of the game-area for the new asteroid
  // --> Adds a new object to the currentAsteroids array and assigns it the properties:
  //    --> pos based on the edge of the game-area (gameAreaSize.width)
  //    --> top based on the previosuly randomised top position
  //    --> id based on a new unique id from uuidv4
  //
  function addAsteroid() {
    let now = d3Now();
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

  // removeAsteroid - Filters the currentAsteroids array and returns all items except the one with the given id
  // parameters: id (string created from uuidv4)
  //
  // Basic flow:
  // --> Filter through the currentAsteroids array, return a new array containing all items except the one with the id given as a parameter
  // --> Assign this new array as the currentAsteroids array
  //
  function removeAsteroid(id) {
    setCurrentAsteroids(
      currentAsteroids.filter((asteroid) => asteroid.id !== id)
    );

    setCurrentScore((currentScore) => currentScore + baseAsteroidScore);
  }

  // removeShot - Same as the removeAsteroid function but with shots
  //
  function removeShot(id) {
    setCurrentShots(currentShots.filter((shot) => shot.id !== id));
  }

  function getUserName() {
    const auth = authenticate();
    if (auth) {
      return JSON.parse(localStorage.getItem("name"));
    } else {
      return "star";
    }
  }

  // LoseGame - Sets the values that indicate the game is over and resets all shots and asteroids
  //
  // Basic flow:
  // --> Empty the currentAsteroids array
  // --> Empty currentShots array
  // --> Set the gameOver boolean to true
  // --> Set the gameStarted boolean to false
  //

  function LoseGame() {
    console.log("Game Over");
    setLoggedInUser(getUserName);
    setCurrentAsteroids([]);
    setCurrentShots([]);
    setplayerPos(250);
    setgameOver(true);
    setGameStarted(false);
  }
  //COLLECTING PLAYER INPUT
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e.keyCode);
      // Function that reacts to down presses buttons.
      if (validUpKeyCodes.includes(e.keyCode)) {
        setUpIsPressed(true);
        if (!gameOver && !gameStarted) {
          setAsteroidSpeed(gameAreaSize.width * 0.005);
          setGameStarted(true);
        }
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setDownIsPressed(true);
        if (!gameOver && !gameStarted) {
          setAsteroidSpeed(gameAreaSize.width * 0.005);
          setGameStarted(true);
        }
      }
      if (e.keyCode === 32) {
        setSpaceIsPressed(true);
      }
    };

    // --> Valid buttons are required for the game to start
    // Basic flow:
    // --> ValidUpKeyCodes and validDownKeyCodes are condition checks if the down presses button is valid
    // --> If the button is valid, 'upIsPressed is set to 'true'
    // --> GameOver & gameStarted is being controlled to be true, and if so, the code continues running

    const handleKeyUp = (e) => {
      console.log(e.keyCode);

      if (gameOver && validRestartKeyCodes.includes(e.keyCode)) {
        setgameOver(false);
        setCurrentScore(0);
        //Do more stuff to restart the game
        // COMMENT - Do something to this?
      }

      if (validUpKeyCodes.includes(e.keyCode)) {
        setUpIsPressed(false);
      }
      if (validDownKeyCodes.includes(e.keyCode)) {
        setDownIsPressed(false);
      }
      if (e.keyCode === 32) {
        setSpaceIsPressed(false);
      } // What does 32 mean?
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  // GENERAL SUGGESTION FOR RESTRUCTURING:
  // TRY TO SEPERATE THE USEEFFECTS INTO SEPERATE COMPONENTS
  // - ONE FOR ACCEPTING INPUTS
  // - ONE FOR MOVING THE PLAYER
  // - ONE FOR MOVING SHOTS, ASTEROIDS AND MANAGING COLLISIONS
  // - ONE FOR MANAGING AND MOVING THE BACKGROUND

  // COMMUNICATE STATES BETWEEN THESE DIFFERENT STATES WITH USECONTEXT

  // WIP
  // {
  // USE CONTEXT
  // WHAT VARIABLES GO WHERE:
  // ASTEROIDS + SHOOTING COLLISION AND MOVEMENT
  // COLLISION COMPONENT (WRAPS AROUND THE ASTEROIDS, SHOOTING AND PLAYER MOVEMENT COMPONENTS)
  //    + currentAsteroids
  //    + currentShots
  //    + playerPos
  // -- ASTEROID MOVEMENT/SPAWNING COMPONENT
  //    + asteroidTimer
  // -
  // }

  // SUGGESTION:
  // UPDATE THE DEPENDANCIES TO downIsPressed, upIsPressed, spaceIsPressed, playerPos
  // REMOVED DEPENDANCIES: playerSpeed, currentShots
  //

  //MOVING PLAYER

  // HandleKeyDown and HandleKeyUp are functions reacting to down pressed and released buttons.
  // If the player presses up or down, and the game has not been started or aint over, it is
  // shown as marked and the game is started.
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

  // SEPARATE USE EFFECT FOR TOP AND BOTTOM COLLISION DETECTION
  useEffect(() => {
    if (playerPos < 0) setplayerPos(0);
    else if (playerPos > gameAreaSize.height - playerSize)
      setplayerPos(gameAreaSize.height - playerSize);
  }, [playerPos]);

  //MOVEMENT AND COLLISION
  // The logic of the game is running by terms
  // Basic logic:
  // --> When the dependencies 'downIsPressed,'upIsPressed', 'playerPos',
  // playerSpeed', 'spaceIsPressed, 'currentShots' is changed, the code runs.
  // --> With the useEffect function, the player can move up and down in the game area which is
  // set to a maximum with gameAreaSize.height.

  // SUGGESTION: RESTRUCTURING:
  // REMOVE THE DELTATIME VARIABLE COMPLETELY
  //
  // USEEFFECT SEPERATION:
  // MOVE THE TILES MOVING TO A SEPERATE USEEFFECT WITH A SEPERATE INTERVAL
  //
  useEffect(() => {
    let interval = d3Interval(() => {
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed);
      //D3Interval is collected from D3.js library
      if (tileOnePos < -gameAreaSize.width) {
        setTileOnePos(gameAreaSize.width);
      }
      if (tileTwoPos < -gameAreaSize.width) {
        setTileTwoPos(gameAreaSize.width);
      }
    }, 10);

    // BACKGROUND MOVING
    //
    // Need help with this one

    /*
    Startar en interval som kör var 10nde ms. ->
    Inuti intervallen:
    De första 2 raderna sätter tilsens nya position till deras tidigare position minus hastigheten som vi bestämt för dem.
    De två olika tilesen har olika startpositioner så det överlappar inte

    De två if satserna kallas bara när positionen på tilsen är längre åt vänster än vad det finns width åt höger och sätter då tillbaka deras position så de är längst åt höger igen 
    
    */

    return () => {
      interval.stop();
    };
  }, [tileOnePos, tileTwoPos]);
  // Using tiles makes the background movement easy

  useEffect(() => {
    setLoggedInUser(getUserName);
    let interval;
    interval = d3Interval(() => {
      if (gameOver) return;
      if (!gameStarted) return;

      // The useEffect function creates a interval function and manages
      // the logic of the game and updates after how the game is run.
      //

      // Needs to be updated

      /*
      Sätter den inloggade usern som den nuvarande inloggade usern hela tiden, detta är min dåliga kod för om jag inte uppdaterade den hela tiden så kunde det hända att första scoren man satt som inloggad user inte registrerades med ditt namn utan default
      Startar en interval. 
      Om gameOver är sant så kör intervallen inte längre och stoppas. 
      Samma om gameStarted inte är true
      Om game är started och det inte är gameover ->
      kör addAsteroid funktionnen,
      om det finns mer än 1 asteroid, mappa igenom alla asteroider och ändra deras position med asteroidSpeed. Om en asteroid kommer för långt åt vänster dvs -200 förlora spelet.

      Nästa if om någon asteroids pos och top plus pos och top + asteroid size är innanför playerOffset och player top och playerOffset och playertop + playerSize förlora spelet. 
      Denna if satsen är lite komplicerad i text men tänkt dig att vi skapar 2 lådor en som är runt spelaren och en som är runt asteroiden, om de rör varandra på något sätt så förlorar du.
      
      */

      addAsteroid();
      // New asteroid function

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

          // PLAYER MOVEMENT AND ASTEROIDS

          // Basic logic:
          // --> Asteroid is being added
          // --> At least one asteroid in the area is controlled
          // --> Asteroid position is updated by map-loop with asteroid-pos and asteroidSpeed
          // --> If the asteroid.pos is less than 200, which is the permitted area,
          // the asteroid hits playerPos width and game
          // ends with 'LoseGame' function

          // check this one

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

          // COLLISION BETWEEN ASTEROID AND SHOT
          // Basic logic:
          // --> CurrentShots.length <= controls if at least one shot exists in the array
          // with length 1
          // The shot is controlled by the 'shot.pos' and 'shotSpeed'
          // --> If the position passes the gameAreaSize.width, 'removeShot(shot.id)' is
          // makes the shot dissapear.

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
  }, [playerPos, currentAsteroids, currentShots]);

  // SHOT MOVEMENT
  // Basic logic:
  // --> 'currentShots.length' array controlled to be at least 1.
  // --> If shot is at least 1, map-method is run.
  // '.map()'-loop updates the position by increasing shot.pos
  // --> If shot.pos is larger than 'gameAreaSize.width', shot is removed from area.

  // 5 milli seconds needs to be explained.

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
          userLogin={userLogin}
          userRegister={userRegister}
        ></Overlay>

        <div style={playerStyle} className="player"></div>
      </div>
      <Leaderboard
        gameSize={gameAreaSize}
        currentScore={currentScore}
        gameOver={gameOver}
        playerName={loggedInUser}
      />

      <BottomBar
        gameAreaSize={gameAreaSize}
        setUserLogin={setUserLogin}
        setUserRegister={setUserRegister}
        userLogin={userLogin}
        userRegister={userRegister}
        playerName={loggedInUser}
      />
    </div>
  );
}

// Needs to be explained.

export default App;
