import { useState } from "react";
import axios from "axios";

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
    <div className="container">
      <div>
        <form className="form-container">
          <h1>Register User</h1>
          <label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn" type="submit" onClick={handleSubmit}>
            <p>Register</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
