import { useState } from "react";
import axios from "axios";
import Card from "./Card";

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const checkUsername = (users) => {
        const user = users.find((user) => user.username === username);
        if (user) return user;
    };

    const handleSubmit = async () => {
        const user = await axios
            .get("/users")
            .then((res) => checkUsername(res.data, username));

        if (user) {
            alert("Username already exists!");
        } else {
            const user = { username, password };
            axios.post("/users", user).then(alert("User created!"));
        }
    };

    return (
        <div className="container">
            <Card>
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
            </Card>
        </div>
    );
};

export default Register;