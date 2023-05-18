import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";

// Uuidv4 is used for creating unique ids for the shot and asteroid objects
// The ids created by the uuidv4 function are strings and look roughly like 'b1c4a89e-4905-5e3c-b57f-dc92627d011e'
// More info:
// https://www.npmjs.com/package/uuid
//
import { v4 as uuidv4 } from "uuid";

const AsteroidManager = () => {
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

  useEffect(() => {
    addAsteroid();
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

  return(
    <AsteroidRenderer />
  )
}