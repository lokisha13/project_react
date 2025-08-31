import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp} from "firebase/firestore";

function Reservation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (name.trim().length < 3) {
      alert("Name must be at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      alert("Invalid email format");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone must be 10 digits");
      return;
    }
    if (!date) {
      alert("Please select a date");
      return;
    }
    if (guests < 1) {
      alert("Guests must be at least 1");
      return;
    }

    // Check for past date
    const today = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("You cannot reserve for past dates");
      return;
    }

    setLoading(true);

    try {
      // Check number of reservations for the selected date
      const reservationsRef = collection(db, "users");
      const q = query(reservationsRef, where("date", "==", date));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size >= 20) {
        alert("Sorry, maximum 20 reservations allowed for this date");
        setLoading(false);
        return;
      }

      // Add reservation
      await addDoc(reservationsRef, {
  name,
  email,
  phone,
  date,
  guests: Number(guests),
  timestamp: serverTimestamp(),
});


      setSuccess(true);

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setGuests(1);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Error submitting form. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80";

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  };

  const cardStyle = {
    position: "relative",
    zIndex: 2,
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif",
  };

  const inputStyle = {
    marginBottom: "1.2rem",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "100%",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.9rem",
    fontSize: "1.1rem",
    background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const backButtonStyle = {
    marginBottom: "1rem",
    display: "inline-block",
    color: "#ff7e5f",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={cardStyle}>
        <Link to="/" style={backButtonStyle}>
          &larr; Back to Home
        </Link>

        <h2 style={{ marginBottom: "1.5rem", color: "#ff7e5f" }}>Make a Reservation</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Number of Guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="1"
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Submitting..." : "Reserve Now"}
          </button>
        </form>

        {success && (
          <div className="alert alert-success mt-3" role="alert">
            Reservation successful!
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservation;
