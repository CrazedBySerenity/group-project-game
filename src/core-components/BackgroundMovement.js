import {useState, useEffect, useContext} from 'react';
import { SettingsContext, GameStateContext } from '../helpers/context';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import {interval as d3Interval } from "d3-timer";
import Settings from '../helpers/Settings';

const BackgroundMovement = () => {

  const settings = Settings();
  const gameState = useContext(GameStateContext);

  const bgScrollSpeed = settings.bgScrollSpeed;

  const gameAreaSize = gameState.gameAreaSize; //PROBLEMS

  // THE POSITION OF THE FIRST BACKGROUND TILE (FIRST AND SECOND HAS NO REAL IMPLICATION SINCE THEY SWAP AROUND) [NUMBER]
  const [tileOnePos, setTileOnePos] = useState(0);
  // THE POSTION OF THE SECOND BACKGROUND TILE (FIRST AND SECOND HAS NO REAL IMPLICATION SINCE THEY SWAP AROUND) [NUMBER]
  const [tileTwoPos, setTileTwoPos] = useState(gameAreaSize.width);



  const tileOneStyle = {
    left: `${tileOnePos}px`,
  };

  const tileTwoStyle = {
    left: `${tileTwoPos}px`,
  };

// Move Background tiles
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

    return () => { interval.stop(); }

  }, [tileOnePos, tileTwoPos])

  return(
    <>
    <div style={tileOneStyle} className="background__tile"></div>
    <div style={tileTwoStyle} className="background__tile"></div>
    </>
  )
  // Using tiles makes the background movement easy
}

export default BackgroundMovement;