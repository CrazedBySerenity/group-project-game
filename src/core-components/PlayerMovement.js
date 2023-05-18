import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";

const PlayerMovement = () => {

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

    // SEPARATE USE EFFECT FOR TOP AND BOTTOM COLLISION DETECTION

    useEffect(() => {
        if (playerPos < 0) setplayerPos(0);
        else if (playerPos > gameAreaSize.height - playerSize)
          setplayerPos(gameAreaSize.height - playerSize);
      }, [playerPos]);
    

}