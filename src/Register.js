// Import for react components
// useState - https://react.dev/reference/react/useState
//
import { useState } from "react";

// Import axios component
// axios - https://www.npmjs.com/package/axios
//
import axios from "axios";

const Register = () => {

  // THE CURRENTLY TYPED IN USERNAME [STRING]
  const [username, setUsername] = useState("");
  // THE CURRENTLY TYPED IN PASSWORD [STRING]
  const [password, setPassword] = useState("");

  // checkUsername - Basic function to check if the currently typed in username already exists in the database
  // Arguments: users [ARRAY OF OBJECTS CONTAINING A username PROPERTY]
  // Basic flow:
  // --> Checks if the username variables exists as a property of any of the objects in the given users array
  // --> Returns the first element that matches
  // return: user [OBJECT WITH A username PROPERTY]
  //
  const checkUsername = (users) => {
    const user = users.find((user) => user.username === username);
    if (user) return user;
  };

  // handleSubmit - Function to put the typed in username and password into the json database
  // Arguments: e [EVENT OBJECT]
  // Basic flow:
  // --> Call e.preventDefault to stop the page from refreshing
  // --> Pull the existing profiles from the database
  // --> Check if the currently typed in username already exists as a profile in the database
  // --> Check if the username input is empty
  // --> Check if the password input is empty
  // --> If none of the above apply then post the current username and password as a new profile to the database
  // --> Reset the input for username and password
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await axios
      .get("http://localhost:6001/profiles")
      .then((res) => checkUsername(res.data, username));

    if (username === "" || password === "") {
      alert("Please enter all fields");
    } else if (user) {
      alert("Username already exists!");
    } else {
      const newUser = { username, password };

      axios
        .post("http://localhost:6001/profiles", newUser)
        .then(alert("User created"))
        .then(console.log("User created"));
    }
    setUsername("");
    setPassword("");

    // SUGGESTION: ACTIVATE THE LOGIN PAGE AFTER A SUCCESSFUL REGISTRATION
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
