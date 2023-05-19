import {useState, useEffect, useContext} from 'react';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";
import { GameObjectsContext, GameStateContext, InputContext } from '../helpers/context';
import Settings from '../helpers/Settings';

const PlayerMovement = () => {

    const gameObjects = useContext(GameObjectsContext);
    const input = useContext(InputContext);
    const gameState = useContext(GameStateContext);
    const gameAreaSize = gameState.gameAreaSize;
    const settings = Settings();

    //MOVING PLAYER
    useEffect(() => {
        if (gameState.gameOver) return;
        if (!gameState.gameStarted) return;
        let interval;
        interval = d3Interval(() => {
          if (!(gameObjects.playerPos < 0)) {
            if (!input.downIsPressed && input.upIsPressed) {
              gameObjects.setPlayerPos((playerPos) => playerPos - settings.playerSpeed);
            }
          }
    
          if (!(gameObjects.playerPos > gameAreaSize.height - settings.playerSize)) {
            if (input.downIsPressed && !input.upIsPressed) {
              gameObjects.setPlayerPos((playerPos) => playerPos + settings.playerSpeed);
            }
          }
        }, 20);
    
        return () => {
          interval.stop();
        };
      }, [
        input.downIsPressed,
        input.upIsPressed,
        gameObjects.playerPos,
        settings.playerSpeed,
        input.spaceIsPressed,
      ]);

    // SEPARATE USE EFFECT FOR TOP AND BOTTOM COLLISION DETECTION
    useEffect(() => {
        if (gameObjects.playerPos < 0) gameObjects.setPlayerPos(0);
        else if (gameObjects.playerPos > gameAreaSize.height - settings.playerSize)
          gameObjects.setPlayerPos(gameAreaSize.height - settings.playerSize);
      }, [gameObjects.playerPos]);
    

}

export default PlayerMovement;