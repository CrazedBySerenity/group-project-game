import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";

const Collision = () => {
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

  useEffect(() => {
    let interval;
    interval = d3Interval(() => {
      if (gameOver) return;
      if (!gameStarted) return;
      // The useEffect function creates a interval function and manages
      // the logic of the game and updates after how the game is run.
      //

      // COLLISION
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

          // COLLISION BETWEEN ATEROID AND SHOT
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
}