import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";
import Settings from '../helpers/Settings';
import { GameObjectsContext, GameStateContext } from '../helpers/context';

const Collisions = () => {

  const settings = Settings();
  const gameObjects = useContext(GameObjectsContext);
  const gameState = useContext(GameStateContext);
  // removeAsteroid - Filters the currentAsteroids array and returns all items except the one with the given id
  // parameters: id (string created from uuidv4)
  //
  // Basic flow:
  // --> Filter through the currentAsteroids array, return a new array containing all items except the one with the id given as a parameter
  // --> Assign this new array as the currentAsteroids array
  //
  function removeAsteroid(id) {
    gameObjects.setCurrentAsteroids(
      gameObjects.currentAsteroids.filter((asteroid) => asteroid.id !== id)
    );

    gameState.setCurrentScore((currentScore) => currentScore + settings.baseAsteroidScore);
  }

  // removeShot - Same as the removeAsteroid function but with shots
  //
  function removeShot(id) {
    gameObjects.setCurrentShots(gameObjects.currentShots.filter((shot) => shot.id !== id));
  }

  useEffect(() => {
    let interval;
    interval = d3Interval(() => {
      if (gameState.gameOver) return;
      if (!gameState.gameStarted) return;
      // The useEffect function creates a interval function and manages
      // the logic of the game and updates after how the game is run.
      //

      // COLLISION
      if (gameObjects.currentAsteroids.length >= 1) {
        gameObjects.currentAsteroids.map((asteroid) => {
          asteroid.pos -= settings.asteroidSpeed;

          if (asteroid.pos < -200) {
            gameState.LoseGame();
            //removeAsteroid(asteroid.id);
          }

          if (
            asteroid.pos < settings.playerOffset + settings.playerSize &&
            asteroid.pos + settings.asteroidSize > settings.playerOffset &&
            asteroid.top - settings.asteroidSize < gameObjects.playerPos &&
            asteroid.top > gameObjects.playerPos + settings.playerSize
          ) {
            gameState.LoseGame();
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

          if (gameObjects.currentShots.length >= 1) {
            gameObjects.currentShots.map((shot) => {
              shot.pos += settings.shotSpeed;

              if (shot.pos > gameState.gameAreaSize.width) {
                removeShot(shot.id);
              }

              if (
                asteroid.pos < shot.pos + shot.width &&
                asteroid.pos + settings.asteroidSize > shot.pos &&
                asteroid.top <= shot.top + shot.height * 2 &&
                asteroid.top + settings.asteroidSize > shot.top - shot.height
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
      } else if (gameObjects.currentShots.length >= 1) {
        gameObjects.currentShots.map((shot) => {
          shot.pos += settings.shotSpeed;

          if (shot.pos > gameState.gameAreaSize.width) {
            removeShot(shot.id);
          }

          return shot;
        });
      }
    }, 5);

    return () => {
      interval.stop();
    };
  });
}

export default Collisions;