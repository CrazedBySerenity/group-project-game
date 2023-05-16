// Import for react components
// useState - https://react.dev/reference/react/useState
//
import { useState } from "react";
// Import axios component
// axios - https://www.npmjs.com/package/axios
//
import axios from "axios";

const Login = () => {
  // THE CURRENTLY TYPED IN USERNAME [STRING]
  const [username, setUsername] = useState("");
  // THE CURRENTLY TYPED IN PASSWORD [STRING]
  const [password, setPassword] = useState("");

  // checkUsername - Basic function to check if the currently typed in username and password already exist together in the database
  // Arguments: users [ARRAY OF OBJECTS CONTAINING A username AND password PROPERTY], username [STRING], password [STRING]
  // Basic flow:
  // --> Checks if the username and password variable exists as a property of any of the objects in the given users array
  // --> Returns the first element that matches
  // return: user [OBJECT WITH A username AND password PROPERTY]
  //
  const checkUsername = (users) => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    console.log(user);
    if (user.username === username && user.password === password) return user;
  };

  // handleSubmit - Function to put the typed in username and password into the json database
  // Arguments: e [EVENT OBJECT]
  // Basic flow:
  // --> Call e.preventDefault to stop the page from refreshing
  // --> Check if either of the inputs are empty, if so display an alert
  // --> Pull the existing profiles from the database
  // --> Check if the currently typed in username and password already exist together in the database
  // --> If the above applies then alert the ser they are logged in and save the current username and password in local storage
  // --> Reset the input for username and password
  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("All fields are required");
    }

    const user = await axios
      .get("/profiles")
      .then((res) => checkUsername(res.data))
      .catch((error) => {
        console.log(error);
      });
    if (user.username === username && user.password === password) {
      console.log("logging in");
      console.log(user.id);
      alert("Logged in!");
      localStorage.setItem("user", JSON.stringify(user.id));
      localStorage.setItem("name", JSON.stringify(user.username));
      window.location.href = "/";
    } else {
      alert("Invalid username or password!");
      setPassword("");
      setUsername("");
    }

    setPassword("");
    setUsername("");
  };
  return (
    <div className="wh-100 flex-center">
      <div className="Login__container flex-center">
        <form className="form__container">
          <h2 style={{ color: "white" }}>Welcome!</h2>
          <label>
            <input
              className="input__field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <input
              className="input__field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="reusable__button"
            onClick={handleSubmit}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
