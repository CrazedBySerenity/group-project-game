import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkUsername = (users, username, password) => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    console.log(user);
    if (user.username === username && user.password === password) return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("All fields are required");
    }

    const user = await axios
      .get("/profiles")
      .then((res) => checkUsername(res.data, username, password))
      .catch((error) => {
        console.log(error);
      });
    if (user) {
      console.log("logging in");
      console.log(user.id);
      alert("Logged in!");
      localStorage.setItem("user", JSON.stringify(user.id));
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
