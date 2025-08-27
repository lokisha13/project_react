import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Reservation from "./components/Reservation";
import About from "./components/About";
import UserList from "./components/UserList"; // import UserList

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<UserList />} /> {/* new route */}
      </Routes>
    </Router>
  );
}

export default App;
