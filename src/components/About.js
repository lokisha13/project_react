import React from "react";
import { Link } from "react-router-dom";

function About() {
  const heroImageUrl = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1470&q=80";

  

  const buttonStyle = {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#ff7e5f",
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer"
  };

  return (
    <div>
      {/* Hero Section */}
      <header 
        className="hero-image text-center text-white flex-grow-1 d-flex flex-column justify-content-center align-items-center"
        style={{ 
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "50vh",
          minHeight: "300px",
          padding: "20px"
        }}
      >
        <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "20px", borderRadius: "10px" ,color:"#e2cd15ff"}}>
          <h1 style={{ fontSize: "2rem" }}>About FoodieHub</h1>
          <p style={{ fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            Bringing delicious meals and amazing offers right to your doorstep.
          </p>
        </div>
      </header>

      {/* About Content */}
      <div className="container mt-5 mb-5 text-center">
        <h2 className="mb-4" style={{ color: "#ff7e5f" }}>Who We Are</h2>
        <p >
          FoodieHub is your ultimate restaurant companion, designed to make ordering, discovering, and enjoying meals easier than ever.
          We aim to provide a seamless experience with interactive menus, special offers, and convenient services.
          Whether you are craving a quick snack, planning a full-course meal, or organizing a special event, FoodieHub ensures every experience is delightful and hassle-free.
          Our platform connects you with top-rated restaurants, offers real-time tracking for your orders, and provides personalized recommendations based on your taste.
          With FoodieHub, you can explore new cuisines, enjoy exclusive discounts, and make reservations effortlessly, all in one place.
          We are committed to delivering quality, speed, and convenience, making sure that every bite you take brings a smile to your face.
          Join our community of food lovers and experience the perfect blend of technology, taste, and exceptional service.
        </p>

        {/* Back to Home Button */}
        <Link to="/" style={buttonStyle}>← Back to Home</Link>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5 bg-dark text-light p-3">
        Developed by LOKI | 2025
      </footer>
    </div>
  );
}

export default About;
