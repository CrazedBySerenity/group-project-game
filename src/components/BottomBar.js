import ReusableButton from "./ReusableButton";
import { authenticate } from "../helpers/Authenticate";
const BottomBar = ({
  gameAreaSize,
  setUserLogin,
  userLogin,
  setUserRegister,
  userRegister,
  playerName,
}) => {
  const auth = authenticate();

  if (auth) {
    return (
      <div
        className="buttons__container"
        style={{ width: gameAreaSize.width + "px" }}
      >
        <p className="generic__text">{`Logged in as ${playerName}`}</p>
        <ReusableButton
          onClick={(e) => {
            localStorage.removeItem("user");
            localStorage.removeItem("name");
            alert("Logged out");
            window.location.href = "/";
          }}
        >
          Log out
        </ReusableButton>
      </div>
    );
  } else {
    return (
      <div
        className="buttons__container"
        style={{ width: gameAreaSize.width + "px" }}
      >
        <ReusableButton
          onClick={(e) => {
            setUserLogin(!userLogin);
            setUserRegister(false);
          }}
        >
          Log in
        </ReusableButton>
        <ReusableButton
          onClick={(e) => {
            setUserRegister(!userRegister);
            setUserLogin(false);
          }}
        >
          Register
        </ReusableButton>
      </div>
    );
  }
};

export default BottomBar;
