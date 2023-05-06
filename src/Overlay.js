import ScoreDisplay from "./ScoreDisplay";

const Overlay = (props) => {
  //   const overlayStyle = {
  //     width: `${props.gameAreaWidth}px`,
  //     height: `${props.gameAreaHeight}px`,
  //   };

  if (props.gameOver) {
    return (
      <div className="wh-100 flex-center">
        <div className="game-over__container flex-center">
          <p className="game-over__text">Game over!</p>
          <div>
            <p className="game-over__text">Final Score</p>
            <p className="game-over__text">{props.score}</p>
          </div>
          <p className="game-over__text">Press ENTER to Restart...</p>
        </div>
      </div>
    );
  } else if (!props.gameStarted) {
    return (
      <div className="wh-100 flex-center">
        <div className="game-start__container flex-center">
          <p className="game-over__text">Shoot down all the asteroids!</p>
          <div style={{ display: "flex" }}>
            <p className="game-over__text">
              Use W/S or Arrow up/ Arrow down to move up and down
            </p>
            <p className="game-over__text">Use SPACEBAR to shoot</p>
          </div>
          <p className="game-over__text">Move up or down to start!</p>
        </div>
      </div>
    );
  }

  return <>{/* <ScoreDisplay score={props.score} /> */}</>;
};

export default Overlay;
