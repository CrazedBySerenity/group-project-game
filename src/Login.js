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
    if (user) return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*if (user === "" || password === "") {
      alert("All fields are required");
    }*/

    const handleSubmit = async () => {
      const user = await axios
        .get("/users")
        .then((res) => checkUsername(res.data, username, password));
      if (user) {
        alert("Login successful!");
      } else {
        alert("Invalid username or password!");

        //   if (user.username === username && user.password === password)
        //     // navigate("/");
        // }
      }
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
                <input type="password" placeholder="Password" />
              </label>
              <button
                className="btn"
                type="submit"
                value={password}
                onchange={(e) => setPassword(e.target.value)}
              >
                <p>Log in</p>
              </button>
            </form>
          </div>
        </div>
      );
    };
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
            <input type="password" placeholder="Password" />
          </label>
          <button
            className="btn"
            type="submit"
            value={password}
            onchange={(e) => setPassword(e.target.value)}
          >
            <p>Log in</p>
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
