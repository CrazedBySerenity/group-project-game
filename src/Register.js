import { useState } from "react";
import axios from "axios";
import ReusableButton from "./components/ReusableButton";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkUsername = (users) => {
    const user = users.find((user) => user.username === username);
    if (user) return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await axios
      .get("http://localhost:6001/profiles")
      .then((res) => checkUsername(res.data, username));
    if (username === "" || password === "") {
      alert("Please enter all fields");
    } else if (username.includes(" ") || password.includes.includes(" ")) {
      alert("No whitespaces allowed");
    } else if (user) {
      alert("Username already exists!");
    } else {
      const newUser = { username, password };

      axios
        .post("http://localhost:6001/profiles", newUser)
        .then(alert("User created"))
        .then(console.log("User created"));

      setUsername("");
      setPassword("");
    }
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
          <ReusableButton onClick={handleSubmit}>Register</ReusableButton>
        </form>
      </div>
    </div>
  );
};

export default Register;
