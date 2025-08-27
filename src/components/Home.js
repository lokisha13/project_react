import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // custom CSS

function Home() {
  const heroImageUrl = "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80";

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar custom-navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">Foodie Hub</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/reservation">Reservation</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li> {/* Added UserList link */}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header 
        className="hero-image text-center text-white" 
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="hero-text">
          <h1>Welcome to Foodie Hub Restaurant</h1>
          <p>Delicious food delivered at your doorstep</p>
          <Link to="/reservation" className="btn btn-warning btn-lg">Reserve Now</Link>
        </div>
      </header>

      <footer className="text-center mt-5 bg-dark text-light p-3">
        Developed by LOKI | 2025
      </footer>
    </div>
  );
}

export default Home;
