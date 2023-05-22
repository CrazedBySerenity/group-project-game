// Imports for react components
// useEffect - https://react.dev/reference/react/useEffect
// useState - https://react.dev/reference/react/useState
// useRef - https://react.dev/reference/react/useRef
//
import { useEffect, useState, createContext } from "react";

// Authenticate is used to grab the current username if there is one
import { authenticate } from "./helpers/Authenticate";

import { GameObjectsContext, GameStateContext, InputContext } from "./helpers/context";

import {now as d3Now} from 'd3-timer';

// Custom Hooks
// useWindowDimensions - Simple hook that returns an object with a width and height property corresponding to the window size in pixels
// return: {width: Current screen width, height: Current screen height}
//
import useWindowDimensions from "./hooks/UseWindowDimensions";

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
import BackgroundMovement from './core-components/BackgroundMovement';
import AsteroidManager from "./core-components/AsteroidManager";
import PlayerMovement from "./core-components/PlayerMovement";
import Shooting from "./core-components/Shooting";
import Collisions from "./core-components/Collisions";

import Settings from "./helpers/Settings";


function App() {

  // OBJECT CONTAINING CURRENT SIZE OF THE WINDOW [OBJECT]
  let windowSize = useWindowDimensions();

  // OBJECT CONTAINING THE SIZE FOR THE GAMEAREA BASED ON WINDOW SIZE
  const gameAreaSize = {
    width: windowSize.width < 2000 ? windowSize.width : 2000,
    height: windowSize.height < 500 ? windowSize.height : 500,
  };

  const settings = Settings();

  // THE PLAYERS CURRENT POSITION (VERTICAL) [NUMBER]
  const [playerPos, setPlayerPos] = useState(250);

  // THE ARRAY CONTAINING THE CURRENT ASTEROIDS ON THE FIELD [ARRAY OF OBJECTS]
  // ASTEROIDS ARE REPRESENTED WITH OBJECTS AND IT'S RELEVANT VALUES WITH PROPERTIES
  //
  // STRUCTURE EXAMPLE: [{pos, top, id}, {pos, top, id}, {pos, top, id}, {pos, top, id}]
  const [currentAsteroids, setCurrentAsteroids] = useState([]);

  // THE ARRAY CONTAINING THE CURRENT SHOTS ON THE FIELD [ARRAY OF OBJECTS]
  // SHOTS ARE REPRESENTED WITH OBJECTS AND IT'S RELEVANT VALUES WITH PROPERTIES
  //
  // STRUCTURE EXAMPLE: [{pos, top, id, width, height}, {pos, top, id, width, height}, {pos, top, id, width, height}]
  const [currentShots, setCurrentShots] = useState([]);

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


  const [playerShoot, setPlayerShoot] = useState(() => {console.log("no shooting function assigned")});
  const shooting = {playerShoot, setPlayerShoot};
  function shootTest () {
    console.log('success');
  }

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

  const backgroundContainerStyle = {
    width: `${gameAreaSize.width}px`,
    height: `${gameAreaSize.height}px`,
  };

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
    setPlayerPos(250);
    setgameOver(true);
    setGameStarted(false);
    
    // SUGGESTION: Remove gameStarted being set to false and instead pass the gameOver variable to the Overlay component 
    // so that it can check if gameOver is true. All other places where gameStarted is used already has this kind of check
  }

  //COLLECTING PLAYER INPUT
  // HandleKeyDown and HandleKeyUp are functions called when a key is pressed or released
  // If the player presses up or down, and the game has not been started or aint over, it is 
  // shown as marked and the game is started. 
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

    useEffect(() => {
      setLoggedInUser(getUserName);
    })
    //MOVEMENT AND COLLISION
    // The logic of the game is running by terms
    // Basic logic:
    // --> When the dependencies 'downIsPressed,'upIsPressed', 'playerPos', 
    // playerSpeed', 'spaceIsPressed, 'currentShots' is changed, the code runs.
    // --> With the useEffect function, the player can move up and down in the game area which is 
    // set to a maximum with gameAreaSize.height.

  

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

        </div>
          <GameStateContext.Provider value={{
            loggedInUser: loggedInUser,
            userLogin: userLogin,
            userRegister: userRegister, 
            gameStarted: gameStarted,
            gameOver: gameOver,
            currentScore: currentScore,
            setCurrentScore,
            gameAreaSize: gameAreaSize,
            LoseGame,
          }}>
            <BackgroundMovement></BackgroundMovement>
            <InputContext.Provider value={{
              validUpKeyCodes: validUpKeyCodes,
              validDownKeyCodes: validDownKeyCodes, 
              validRestartKeyCodes: validRestartKeyCodes,
              downIsPressed: downIsPressed,
              upIsPressed: upIsPressed,
              spaceIsPressed: spaceIsPressed
            }}>
              <GameObjectsContext.Provider value={{
                playerPos: playerPos,
                setPlayerPos: setPlayerPos,
                currentAsteroids: currentAsteroids,
                setCurrentAsteroids,
                currentShots: currentShots,
                setCurrentShots,
              }}>
                  <AsteroidManager />
                  <PlayerMovement />
                  <Shooting />
                  <Collisions />
                </GameObjectsContext.Provider>
              </InputContext.Provider>
          </GameStateContext.Provider>



          

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
