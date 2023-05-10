import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReusableButton from "./components/ReusableButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const navigate = useNavigate();

  const checkUsername = (users, username, password) => {
    const user = users.find(
      (user) => user.username === username && user.username === password
    );
    console.log(user);
    if (user.username === username && user.password === password) return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("All fields are required");
    } else if (username.includes(" ") || password.includes.includes(" ")) {
      alert("No whitespaces allowed");
    } else {
      const user = await axios
        .get("/profiles")
        .then((res) => checkUsername(res.data, username, password))
        .catch((error) => {
          console.log(error);
        });
      if (user) {
        alert("Login successful!");
      } else {
        alert("Invalid username or password!");
        setPassword("");
        setUsername("");

        //   if (user.username === username && user.password === password)
        //     // navigate("/");
        // }
      }
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
          <ReusableButton onClick={handleSubmit}>Log in</ReusableButton>
        </form>
      </div>
    </div>
  );
};
export default Login;
