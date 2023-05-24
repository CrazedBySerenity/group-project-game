// Custom Components
// Register - Component that contains logic and a simple UI for registering a new user
// Login - Component that contains logic and a simple UI for Logging in
//
import Register from "./Register";
import Login from "./Login";

const Overlay = (props) => {
  // Basic Flow:
  // --> Display the registration UI if the player wants to register
  // --> Display the login UI if the player wants to log in
  // --> Display the UI for restarting the game if the player has lost
  // --> Display the UI for starting the game if the player has not yet done so
  // --> If none of the above apply then return nothing (Hide the overlay)
  //
  if (props.userRegister) {
    return <Register></Register>;
  } else if (props.userLogin) {
    return <Login></Login>;
  } else if (props.gameOver) {
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

  return <>{}</>;
};

export default Overlay;
