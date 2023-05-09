import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./com ponents/Login";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter classname="p-3">
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;