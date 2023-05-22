import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";
import Settings from '../helpers/Settings';

// Uuidv4 is used for creating unique ids for the shot and asteroid objects
// The ids created by the uuidv4 function are strings and look roughly like 'b1c4a89e-4905-5e3c-b57f-dc92627d011e'
// More info:
// https://www.npmjs.com/package/uuid
//
import { v4 as uuidv4 } from "uuid";
import { GameObjectsContext, GameStateContext } from '../helpers/context';
import Asteroid from '../components/Asteroid';

const AsteroidManager = () => {

  // THE TIME WHEN THE NEXT ASTEROID SHOULD BE SPAWNED IN, REPRESENTED BY A NUMBER IN MILLISECONDS SLIGHTLY LARGER THAN DATE.NOW [NUMBER]
  // The default value indicates the amount of milliseconds before the first asteroid spawns
  // SUGGESTION: ELABORATE ON THIS EXPLANATION
  const [asteroidTimer, setAsteroidTimer] = useState(d3Now() + 4000);

  const gameObjects = useContext(GameObjectsContext);
  const gameState = useContext(GameStateContext);

  const gameAreaSize = gameState.gameAreaSize;
  const settings = Settings();

  const asteroidSize = settings.asteroidSize;

  // The properties settings.asteroidSpawnTimer.min and .max can only be accessed by using settings.min and .max, not sure why
  const asteroidSpawnTimer = {min: settings.asteroidSpawnTimer.min, max: settings.asteroidSpawnTimer.max};
  const maxAsteroids = settings.maxAsteroids;
  

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
      console.log('hey');
      let newTimer =
        now +
        (Math.random(asteroidSpawnTimer.max - asteroidSpawnTimer.min) +
          asteroidSpawnTimer.min) *
        1000;
      setAsteroidTimer(newTimer);
      if (gameObjects.currentAsteroids.length < maxAsteroids) {
        let newAsteroidTop = Math.floor(
          Math.random() * (gameAreaSize.height - asteroidSize)
        );
        if (newAsteroidTop < asteroidSize) {
          newAsteroidTop = asteroidSize;
        }

        gameObjects.setCurrentAsteroids([
          ...gameObjects.currentAsteroids,
          {
            pos: gameAreaSize.width,
            top: newAsteroidTop,
            id: uuidv4(),
          },
        ]);
      }
    }
  }

  useEffect(() => {
    let interval;
    interval = d3Interval(() => {
      let now = d3Now();
      //Check timer and set timer
      if (asteroidTimer < now && !gameState.gameOver && gameState.gameStarted) {
        console.log('Asteroid spawned');
        let newTimer =
          now +
          (Math.random(asteroidSpawnTimer.max - asteroidSpawnTimer.min) +
            asteroidSpawnTimer.min) *
          1000;
        setAsteroidTimer(newTimer);
        if (gameObjects.currentAsteroids.length < maxAsteroids) {
          let newAsteroidTop = Math.floor(
            Math.random() * (gameAreaSize.height - asteroidSize)
          );
          if (newAsteroidTop < asteroidSize) {
            newAsteroidTop = asteroidSize;
          }
  
          gameObjects.setCurrentAsteroids([
            ...gameObjects.currentAsteroids,
            {
              pos: gameAreaSize.width,
              top: newAsteroidTop,
              id: uuidv4(),
            },
          ]);
        }
      }
    }, 60);

    return () => {
      interval.stop();
    };
  })

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
    let visibleAsteroids = gameObjects.currentAsteroids.map((asteroid) => (
      <Asteroid
        key={asteroid.id}
        pos={asteroid.pos}
        top={asteroid.top}
        size={asteroidSize}
      />
    ));
    return visibleAsteroids;
  }

  return(
    <AsteroidRenderer />
  )
}

export default AsteroidManager;