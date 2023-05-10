import ReusableButton from "./ReusableButton";
import { authenticate } from "../helpers";
const BottomBar = ({
  gameAreaSize,
  setUserLogin,
  userLogin,
  setUserRegister,
  userRegister,
}) => {
  const auth = authenticate();

  if (auth) {
    return (
      <div
        className="buttons__container"
        style={{ width: gameAreaSize.width + "px" }}
      >
        <h2 style={{ color: "white" }}>Logged in as </h2>
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
