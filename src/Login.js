import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="container">
      <div>
        <form className="form-container">
          <h1>Welcome!</h1>
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
            <p>Log in</p>
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
