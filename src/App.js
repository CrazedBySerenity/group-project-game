import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

function App() {

  const [playerPosition, setPlayerPosition] = useState(250);
  const [playerSpeed, setPlayerSpeed] = useState(10);
  const [tileOnePos, setTileOnePos] = useState(0);
  const [tileTwoPos, setTileTwoPos] = useState(2000);

  const validUpKeyCodes = [38, 87];
  const validDownKeyCodes = [40, 83];

  const playerSize = 40;
  const gameAreaSize = 500;
  const bgScrollSpeed = 5;

  const gameAreaStyle = {
    backgroundColor: 'black',
    width: `${gameAreaSize}px`,
    height: `${gameAreaSize}px`,
  }

  const playerStyle = {
    position: `absolute`,
    backgroundColor: 'red',
    width: `${playerSize}px`,
    height: `${playerSize}px`,
    top: `${playerPosition}px`,
  };

  const tileOneStyle = {
    left: `${tileOnePos}px`,
  };

  const tileTwoStyle = {
    left: `${tileTwoPos}px`,
  };

  useEffect(() => {
    const handleKeyDown = (e) =>{
      console.log(e.keyCode);

      if(validUpKeyCodes.includes(e.keyCode)){
        setPlayerPosition(playerPosition => playerPosition - playerSpeed)
      }
      if(validDownKeyCodes.includes(e.keyCode)){
        setPlayerPosition(playerPosition => playerPosition + playerSpeed)
      }
    }

    document.addEventListener('keydown', handleKeyDown) 
  }, [])

  useEffect(() => {
    let timeId;
    timeId = setInterval(() => {
      setTileOnePos((tileOnePos) => tileOnePos - bgScrollSpeed);
      setTileTwoPos((tileTwoPos) => tileTwoPos - bgScrollSpeed);

      if(tileOnePos < -2000){
        setTileOnePos(2000);
      }
      if(tileTwoPos < -2000){
        setTileTwoPos(2000);
      }
      
    }, 24);

    return(() => {
      clearInterval(timeId);
    });
  }, [tileOnePos, tileTwoPos])


  return (
    <div className="App">
      <div style={gameAreaStyle} className="game-area">
        <div className="background__container">
          <div style={tileOneStyle} className="background__tile"></div>
          <div style={tileTwoStyle} className="background__tile"></div>
        </div>
        <div>
          
        </div>
        <div style={playerStyle} className="player"></div>
      </div>

    </div>
  );
}

export default App;
